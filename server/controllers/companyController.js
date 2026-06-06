import Company from '../models/Company.js';

export const getCompanyProfile = async (req, res) => {
  try {
    const company = await Company.findById(req.user.companyId);
    if (!company) {
      return res.status(404).json({ message: 'Company profile not found' });
    }
    res.json(company);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateCompanyProfile = async (req, res) => {
  try {
    const company = await Company.findById(req.user.companyId);
    if (!company) {
      return res.status(404).json({ message: 'Company profile not found' });
    }

    Object.assign(company, req.body);
    const updatedCompany = await company.save();
    res.json(updatedCompany);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
