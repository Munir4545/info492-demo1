const { randomUUID } = require('crypto');

const pendingMap = new Map();
let ioInstance = null;
let logger = null;
let dbInstance = null;

function init({ io, log, db }) {
  ioInstance = io;
  logger = log;
  dbInstance = db;
}

function sanitize(record) {
  const { onApprove, onReject, ...rest } = record;
  return rest;
}

function enqueueAction({
  attackId,
  title,
  description,
  category = 'llm-suggestion',
  severity = 'high',
  metadata = {},
  requestedBy = 'System',
  onApprove,
  onReject,
}) {
  if (!attackId || !title || typeof onApprove !== 'function') {
    throw new Error('Invalid human oversight action payload');
  }

  const id = randomUUID();
  const record = {
    id,
    attackId,
    title,
    description,
    category,
    severity,
    metadata,
    requestedBy,
    status: 'pending',
    createdAt: new Date().toISOString(),
    onApprove,
    onReject,
  };

  pendingMap.set(id, record);

  if (logger && dbInstance) {
    logger(attackId, 'HumanLoop', `🛑 Action requires approval: ${title}`, ioInstance, dbInstance);
  }

  ioInstance?.emit('hil:pending', sanitize(record));

  return sanitize(record);
}

function getPendingActions() {
  return Array.from(pendingMap.values()).map(sanitize);
}

function resolveAction(id, status, approver, notes) {
  const record = pendingMap.get(id);
  if (!record) {
    throw new Error('Action not found or already resolved');
  }

  pendingMap.delete(id);

  const payload = {
    ...sanitize(record),
    status,
    resolvedBy: approver,
    resolvedAt: new Date().toISOString(),
    notes: notes || null,
  };

  if (status === 'approved') {
    record.onApprove?.(approver, notes);
  } else {
    record.onReject?.(approver, notes);
  }

  if (logger && dbInstance) {
    const tag = status === 'approved' ? '✅ Approved' : '❌ Rejected';
    const reviewer = approver || 'unknown reviewer';
    logger(
      record.attackId,
      'HumanLoop',
      `${tag} by ${reviewer}: ${record.title}${notes ? ` (${notes})` : ''}`,
      ioInstance,
      dbInstance,
    );
  }

  ioInstance?.emit('hil:resolved', payload);

  return payload;
}

function approveAction(id, approver, notes) {
  return resolveAction(id, 'approved', approver, notes);
}

function rejectAction(id, approver, notes) {
  return resolveAction(id, 'rejected', approver, notes);
}

module.exports = {
  init,
  enqueueAction,
  getPendingActions,
  approveAction,
  rejectAction,
};


