import mongoose from 'mongoose';
import { leadSchema } from './backend/models/Lead.js';

const Lead = mongoose.model('Lead', leadSchema);

const testValidation = async () => {
  const doc = new Lead({
    name: 'Test Lead',
    company: 'Test Co',
    email: 'test@test.com',
    owner: new mongoose.Types.ObjectId(),
    status: 'New',
    source: 'Website',
    value: '' // Simulate empty string from frontend
  });

  try {
    await doc.validate();
    console.log("Validation passed");
  } catch (err) {
    console.log("Error Name:", err.name);
    console.log("Validation Error Details:", err.errors.value.message);
  }
};

testValidation().then(() => process.exit());
