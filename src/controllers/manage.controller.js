import { viewAuditLogService, getImagePathService, getAttachmentPathService } from '../services/manage.service.js';

export const viewAuditLog = async (req, res) => {
  try{
    const {id, role} = req.user;
    const auditLogs = await viewAuditLogService(id, role);
    res.json({auditLogs});
  }catch(error){
    res.status(400).json({error: error.message});
  }
};

export const viewCustomerIDImage = async (req, res) => {
  try{
    const {customerID} = req.params;
    const imagePath = await getImagePathService(customerID);
    res.sendFile(imagePath, (err)=>{
      if (err) res.status(404).json({error: "Image file not found"}); // raise an error if image not found
    });
  }catch(error){
    res.status(404).json({error: error.message});
  }
};

export const viewAttachement = async (req, res) => {
  try{
    const {id, role} = req.user;
    const {appointmentID} = req.params;
    const attachmentPath = await getAttachmentPathService(appointmentID, role, id);
    if (!attachmentPath){
      res.status(200).json({ message: 'No attachment for this appointment'});
    }else{
      res.sendFile(attachmentPath, (err)=>{
        if (err) res.status(404).json({error: "Attachment file not found on disk"});
      });
    }
  }catch(error){
    res.status(400).json({error: error.message});
  }
};