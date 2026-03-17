import { getSlotByParam, createSlotsService, 
         updateSlotsService, deleteSlotService } from '../services/slots.services.js';

export const listSlots = async (req, res) => {
  try{
    const {branchID, serviceTypeId, date} = req.query; // date is optional query parameter
    const slots = await getSlotByParam(branchID, serviceTypeId, date);
    res.status(200).json({slots});
  }catch(error){
    res.status(500).json({error: error.message});
  }
};

// Creates slots in single or bulk
export const createSlots = async (req, res) => {
  try{
    const slotData  = req.body;
    const { role, id } = req.user;
    const createdSlots = await createSlotsService(slotData, id, role);
    res.status(201).json({slots: createdSlots});
  }catch(error){
    res.status(400).json({error: error.message});
  }
};

export const updateSlots = async (req, res) => {
  try{
    const {slotID} = req.params;
    const {role, id} = req.user;
    const slotData = req.body;
    const updateSlots = await updateSlotsService(slotData, slotID, id, role);
    res.status(200).json({updatedSlots: updateSlots})
  }catch(error){
    res.status(400).json({error: error.message});
  }
};

export const softDeleteSlots = async (req, res) => {
  try{
    const {slotID} = req.params;
    const deletedSlot = await deleteSlotService(slotID); 
    res.status(200).json({deleteSlot: deletedSlot});
  }catch(error){
    res.status(400).json({error: error.message});
  }
};