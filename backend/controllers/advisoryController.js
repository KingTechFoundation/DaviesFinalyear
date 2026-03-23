const AdvisoryRequest = require('../models/AdvisoryRequest');
const User = require('../models/User');

// @desc    Create a new advisory request
// @route   POST /api/advisory
const createRequest = async (req, res) => {
  try {
    const { subject, message, category, farmId, cropId, priority } = req.body;
    const location = req.user.farmLocation || 'Musanze District';

    const request = await AdvisoryRequest.create({
      farmerId: req.user._id,
      subject,
      message,
      category,
      farmId,
      cropId,
      priority,
      location
    });

    res.status(201).json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get advisory requests
// @route   GET /api/advisory
const getRequests = async (req, res) => {
  try {
    let query = {};

    if (req.user.role === 'farmer') {
      query.farmerId = req.user._id;
    } else if (req.user.role === 'agronomist') {
      // Filter by agronomist's district
      const district = req.user.farmLocation?.split(',')[0] || 'Musanze District';
      query.location = { $regex: district, $options: 'i' };
    }

    const requests = await AdvisoryRequest.find(query)
      .populate('farmerId', 'name email phone')
      .populate('farmId', 'name')
      .populate('cropId', 'name type')
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Respond to an advisory request
// @route   PUT /api/advisory/:id/respond
const respondToRequest = async (req, res) => {
  try {
    const { message, resources } = req.body;
    const request = await AdvisoryRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    request.response = {
      message,
      respondedAt: Date.now(),
      resources
    };
    request.status = 'responded';
    request.agronomistId = req.user._id;

    await request.save();
    res.json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a request
// @route   DELETE /api/advisory/:id
const deleteRequest = async (req, res) => {
  try {
    const request = await AdvisoryRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    // Only farmer can delete their own request, or agronomist can delete if needed
    if (request.farmerId.toString() !== req.user._id.toString() && req.user.role !== 'agronomist') {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await request.deleteOne();
    res.json({ message: 'Request removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createRequest,
  getRequests,
  respondToRequest,
  deleteRequest
};
