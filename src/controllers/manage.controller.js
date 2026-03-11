import { viewAuditLogService } from '../services/manage.service.js';

export const viewAuditLog = async (req, res) => {
  try{
    const {id, role} = req.user;
    const auditLogs = await viewAuditLogService(id, role);
    res.json({auditLogs});
  }catch(error){
    res.status(400).json({error: error.message});
  }
};