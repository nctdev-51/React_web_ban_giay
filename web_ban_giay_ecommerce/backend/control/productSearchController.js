const Product = require("../models/Product");

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function buildSearchQuery(keyword) {
  const safe = escapeRegex(keyword);
  const regex = new RegExp(safe, "i");

  return {
    $or: [
      { title: regex },
      { description: regex },
      { sport: regex },
      { productType: regex },
      { collection: regex },
    ],
  };
}

async function searchProducts(req, res) {
  try {
    const keyword = String(req.query.q || "").trim();
    if (!keyword) return res.json([]);

    const limit = Math.min(Number(req.query.limit) || 50, 100);
    const products = await Product.find(buildSearchQuery(keyword))
      .limit(limit)
      .lean();

    return res.json(products);
  } catch (error) {
    return res.status(500).json({ message: "Loi tim kiem san pham" });
  }
}

async function suggestProducts(req, res) {
  try {
    const keyword = String(req.query.q || "").trim();
    if (!keyword) return res.json([]);

    const limit = Math.min(Number(req.query.limit) || 6, 20);
    const products = await Product.find(buildSearchQuery(keyword))
      .limit(limit)
      .lean();

    return res.json(products);
  } catch (error) {
    return res.status(500).json({ message: "Loi goi y san pham" });
  }
}

module.exports = { searchProducts, suggestProducts };
