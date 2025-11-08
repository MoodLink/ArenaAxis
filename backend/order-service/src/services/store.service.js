import axios from 'axios';
import { Field } from "../models/field.model.js";

const USER_SERVICE_BASE_URL = process.env.USER_SERVICE_URL;

export async function handleUpdateSportForStore(req, storeId, sportId, hasSport) {
  try {
    const needUpdate = await checkSportInStore(storeId, sportId, hasSport);
    if (needUpdate) {
      await updateSportForStore(req, storeId, sportId, hasSport);
      console.log(`Store ${storeId} sportId ${sportId} updated to ${hasSport}`);
    }
  } catch (error) {
    console.error("Error updating sport for store:", error.message);
  }
}

async function updateSportForStore(req, storeId, sportId, hasSport) {
	try {
		await axios.post(
			`${USER_SERVICE_BASE_URL}/stores/update-sport/${storeId}`,
			{ sportId, hasSport },
      {
        headers: {
          'Authorization': `Bearer ${req.token}`,
          'Content-Type': 'application/json'
        }
      }
		);
		console.log("Sport updated successfully");
	} catch (error) {
		console.error("Failed to call Store Service:", error.response?.data || error.message);
		throw new Error("STORE_SERVICE_UNAVAILABLE");
	}
}

async function checkSportInStore(storeId, sportId, shouldExist = true) {
  const fields = await getFieldsByStore({
    storeId,
    filter: { sportId },
    select: "_id"
  });

  return shouldExist ? fields.length > 0 : fields.length === 0;
}

async function getFieldsByStore({ storeId, filter = {}, select }) {
  const queryObj = { storeId, ...filter };
  const query = Field.find(queryObj);

  if (select) query.select(select);
  return await query.lean();
}
