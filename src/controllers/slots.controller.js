import {getSlotByParam} from '../services/slots.services.js';

export const listSlots = async (req, res) => {
  try{
    const {branchID, serviceTypeId, date} = req.query; // date is optional query parameter
    const slots = await getSlotByParam(branchID, serviceTypeId, date);
    res.json({slots});
  }catch(error){
    console.log("Error: Error in Slot controller!");
    res.status(500).json({error: error.message});
  }
};


