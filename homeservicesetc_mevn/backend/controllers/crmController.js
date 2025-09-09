exports.analytics = async (req, res) => {
  try {
    res.json({
      revenue: {
        total: 5000,
        labels: ["Jan", "Feb", "Mar", "Apr"],
        values: [1200, 1500, 1100, 1200]
      },
      jobs: {
        total: 45,
        labels: ["Plumbing", "Electrical", "Cleaning"],
        values: [15, 20, 10]
      },
      providers: {
        total: 30,
        approved: 20,
        pending: 5,
        rejected: 5
      }
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching CRM data", error: err.message });
  }
};
