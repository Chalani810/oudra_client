// app/utils/treeHelpers.js - FIXED VERSION
const BlockchainService = require('../services/blockchainService');
const TreeNotificationService = require('../services/treeNotificationService');

// Create singleton instance
let notificationService = null;
function getNotificationService() {
    if (!notificationService) {
        notificationService = new TreeNotificationService();
    }
    return notificationService;
}

/**
 * Create history with blockchain and send notifications
 * This is your ONE-STOP function for all tree changes
 */
async function createHistoryWithBlockchain(historyData, treeData = null, modifiedBy = {}, context = {}) {
    try {
        // 1. Create history with blockchain
        const history = await BlockchainService.createHistoryWithBlockchain(historyData);
        
        // 2. Send notifications if tree data provided (runs async, non-blocking)
        if (treeData && treeData.investorId) {
            setImmediate(async () => {
                try {
                    // Determine action type
                    const action = mapHistoryActionToNotification(historyData.actionType);
                    
                    // Extract changes
                    const changes = extractChangesForNotification(
                        historyData.oldValue, 
                        historyData.newValue
                    );
                    
                    // Send all notifications (investor + admin + save alert)
                    const service = getNotificationService();
                    await service.sendTreeNotifications(
                        treeData,
                        action,
                        changes,
                        modifiedBy,
                        context
                    );
                } catch (notifyError) {
                    console.error('Notification error (non-critical):', notifyError.message);
                }
            });
        }
        
        return history;
        
    } catch (error) {
        console.error('Error creating history with blockchain:', error);
        throw error;
    }
}

/**
 * Map TreeHistory actionType to notification action
 */
function mapHistoryActionToNotification(actionType) {
    const mapping = {
        'ManualEdit': 'UPDATE',
        'StatusChange': 'HEALTH_UPDATE',
        'Inoculated': 'INOCULATION',
        'Inspection': 'INSPECTION',
        'LifecycleUpdate': 'LIFECYCLE_UPDATE',
        'NoteAdded': 'UPDATE',
        'Created': 'CREATE',
        'Deleted': 'DELETE'
    };
    return mapping[actionType] || 'UPDATE';
}

/**
 * Extract changes for notifications
 */
function extractChangesForNotification(oldValue, newValue) {
    const changes = [];
    
    if (!newValue) return null;
    
    if (oldValue) {
        // Compare and extract changed fields
        for (const key in newValue) {
            const oldVal = oldValue[key];
            const newVal = newValue[key];
            
            if (JSON.stringify(oldVal) !== JSON.stringify(newVal)) {
                changes.push({
                    field: key,
                    old: oldVal,
                    new: newVal
                });
            }
        }
    }
    
    return changes.length > 0 ? changes : null;
}

/**
 * Helper to extract tree data from Tree model
 */
function prepareTreeDataForNotification(tree, additionalData = {}) {
    return {
        treeId: tree.treeId,
        investorId: tree.investorId,
        investorName: tree.investorName,
        investorEmail: additionalData.investorEmail || null, // Must be passed from request
        healthStatus: tree.healthStatus,
        lifecycleStatus: tree.lifecycleStatus,
        block: tree.block,
        plantedDate: tree.plantedDate,
        inoculationCount: tree.inoculationCount,
        blockchainHash: additionalData.blockchainHash || null,
        ...additionalData
    };
}

/**
 * Helper to prepare modifiedBy data
 */
function prepareModifiedByData(req) {
    return {
        id: req.user?.userId || req.body?.lastUpdatedBy || null,
        name: req.user?.name || req.body?.lastUpdatedBy || 'System Admin',
        role: req.user?.role || 'ADMIN'
    };
}

/**
 * Helper to prepare context data
 */
function prepareContextData(req) {
    return {
        ipAddress: req.ip || req.connection?.remoteAddress || null,
        userAgent: req.headers?.['user-agent'] || null
    };
}

module.exports = {
    createHistoryWithBlockchain,
    mapHistoryActionToNotification,
    extractChangesForNotification,
    prepareTreeDataForNotification,
    prepareModifiedByData,
    prepareContextData
};