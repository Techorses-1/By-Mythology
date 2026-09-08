const express = require("express");
const router = express.Router();
const Product = require("../modals/Product");
const Inventory = require("../modals/Inventory");
const { adminAuth } = require("../middleware/auth");
const upload = require("../middleware/uploadProduct");
const { v4: uuidv4 } = require('uuid');

// Helper function to parse JSON
const parseField = (field) => {
  if (field && typeof field === 'string') {
    try {
      return JSON.parse(field);
    } catch (err) {
      return [];
    }
  }
  return field || [];
};

// Helper to create full image URL
const createImageUrl = (req, filename) => {
  return `${req.protocol}://${req.get("host")}/api/productsimages/${filename}`;
};

// Helper to create inventory entries
async function createInventoryEntries(product) {
  try {
    console.log("🔄 Creating/updating inventory entries for product:", product.productId);

    if (product.type === "simple") {
      if (product.colors && product.colors.length > 0) {
        const color = product.colors[0];
        const fragrances = color.fragrances || [];

        console.log(`📦 Found ${fragrances.length} fragrances for product`);

        for (const fragrance of fragrances) {
          const fragranceName = fragrance.name || fragrance;

          if (fragranceName && fragranceName.trim() !== "") {
            const trimmedFragrance = fragranceName.trim();

            const existingInventory = await Inventory.findOne({
              productId: product.productId,
              colorId: color.colorId,
              fragrance: trimmedFragrance
            });

            if (!existingInventory) {
              const inventoryData = {
                productId: product.productId,
                productName: product.productName,
                modelName: product.modelName || "Default",
                colorId: color.colorId,
                colorName: color.colorName || "Default",
                fragrance: trimmedFragrance,
                stock: 0,
                threshold: 10,
                isActive: true,
              };

              console.log(`➕ Creating NEW inventory for fragrance: ${trimmedFragrance}`);
              await Inventory.create(inventoryData);
            } else {
              console.log(`✅ Inventory already exists for fragrance: ${trimmedFragrance}`);
            }
          }
        }

        if (fragrances.length === 0) {
          const existingDefaultInventory = await Inventory.findOne({
            productId: product.productId,
            colorId: color.colorId,
            fragrance: "Default"
          });

          if (!existingDefaultInventory) {
            await Inventory.create({
              productId: product.productId,
              productName: product.productName,
              modelName: product.modelName || "Default",
              colorId: color.colorId,
              colorName: color.colorName || "Default",
              fragrance: "Default",
              stock: 0,
              threshold: 10,
              isActive: true,
            });
          }
        }
      }
    } else if (product.type === "variable") {
      console.log("ℹ️ Variable product - inventory creation logic not implemented yet");
      if (product.models && product.models.length > 0) {
        for (const model of product.models) {
          if (model.colors && model.colors.length > 0) {
            for (const color of model.colors) {
              const fragrances = color.fragrances || [];

              for (const fragrance of fragrances) {
                const fragranceName = fragrance.name || fragrance;

                if (fragranceName && fragranceName.trim() !== "") {
                  const trimmedFragrance = fragranceName.trim();

                  const existingInventory = await Inventory.findOne({
                    productId: product.productId,
                    variableModelId: model._id || model.modelId,
                    colorId: color.colorId,
                    fragrance: trimmedFragrance
                  });

                  if (!existingInventory) {
                    await Inventory.create({
                      productId: product.productId,
                      productName: product.productName,
                      variableModelName: model.modelName,
                      variableModelId: model._id || model.modelId,
                      colorId: color.colorId,
                      colorName: color.colorName,
                      fragrance: trimmedFragrance,
                      stock: 0,
                      threshold: 10,
                      isActive: true,
                    });
                  }
                }
              }
            }
          }
        }
      }
    }

    console.log("✅ Inventory entries created/updated successfully");
  } catch (err) {
    console.error("❌ Error creating/updating inventory entries:", err.message);
    throw err;
  }
}

// ============================================
// 🟢 ADD PRODUCT - WITH COVER IMAGE
// ============================================
router.post(
  "/add",
  adminAuth,
  (req, res, next) => {
    upload.any()(req, res, (err) => {
      if (err) {
        console.error("❌ Upload error:", err);
        return res.status(400).json({ error: err.message });
      }
      next();
    });
  },
  async (req, res) => {
    try {
      const data = req.body;
      const files = req.files || [];

      console.log("\n" + "=".repeat(50));
      console.log("📥 BACKEND - ADD PRODUCT REQUEST RECEIVED");
      console.log("=".repeat(50));
      console.log("📦 Files received:", files.length);

      // Generate productId if not exists
      if (!data.productId) {
        data.productId = uuidv4();
      }

      // Always set type to "simple"
      data.type = "simple";

      // Set model name same as product name if not provided
      if (!data.modelName && data.productName) {
        data.modelName = data.productName;
      }

      // Parse JSON fields
      data.specifications = parseField(data.specifications);
      data.models = parseField(data.models);

      // Parse colors field
      let colors = parseField(data.colors);
      console.log("🎨 Colors received:", colors?.length || 0);

      // Ensure colors array exists with one "Default" color
      if (!colors || colors.length === 0) {
        colors = [{
          colorId: uuidv4(),
          colorName: "Default",
          fragrances: [],
          images: [],
          originalPrice: data.originalPrice || 0,
          currentPrice: data.currentPrice || 0,
          colorSpecifications: []
        }];
      } else {
        if (colors[0]) {
          colors[0].colorName = "Default";

          if (!colors[0].fragrances) {
            colors[0].fragrances = [];
          }

          // Process each fragrance to ensure it has the correct structure
          colors[0].fragrances = colors[0].fragrances.map(frag => {
            if (typeof frag === 'object' && frag !== null) {
              return {
                name: frag.name || "",
                notes: Array.isArray(frag.notes) ? frag.notes.filter(n => n && n.trim() !== "") : [],
                topNotes: Array.isArray(frag.topNotes) ? frag.topNotes.filter(n => n && n.trim() !== "") : [],
                heartNotes: Array.isArray(frag.heartNotes) ? frag.heartNotes.filter(n => n && n.trim() !== "") : [],
                baseNotes: Array.isArray(frag.baseNotes) ? frag.baseNotes.filter(n => n && n.trim() !== "") : []
              };
            } else if (typeof frag === 'string') {
              return {
                name: frag,
                notes: [],
                topNotes: [],
                heartNotes: [],
                baseNotes: []
              };
            }
            return {
              name: "",
              notes: [],
              topNotes: [],
              heartNotes: [],
              baseNotes: []
            };
          }).filter(frag => frag.name && frag.name.trim() !== "");

          console.log(`✅ Processed ${colors[0].fragrances.length} fragrances with notes`);
        }
      }

      // Process uploaded files
      const thumbnailFile = files.find(file => file.fieldname === 'thumbnail');
      const coverImageFile = files.find(file => file.fieldname === 'coverImage');
      const colorImages = files.filter(file => file.fieldname.startsWith('colorImages'));

      // Save THUMBNAIL image
      if (thumbnailFile) {
        data.thumbnailImage = createImageUrl(req, thumbnailFile.filename);
        console.log("✅ Thumbnail URL created:", data.thumbnailImage);
      } else {
        data.thumbnailImage = "";
      }

      // ✅ NEW: Save COVER IMAGE
      if (coverImageFile) {
        data.coverImage = createImageUrl(req, coverImageFile.filename);
        console.log("✅ Cover Image URL created:", data.coverImage);
      } else {
        data.coverImage = "";
      }

      // Handle color images
      if (colorImages.length > 0 && colors && colors.length > 0) {
        const uploadedImages = {};

        colorImages.forEach(file => {
          const match = file.fieldname.match(/colorImages\[(\d+)\]/);
          if (match) {
            const colorIndex = parseInt(match[1]);
            if (!uploadedImages[colorIndex]) {
              uploadedImages[colorIndex] = [];
            }
            const imageUrl = createImageUrl(req, file.filename);
            uploadedImages[colorIndex].push(imageUrl);
          }
        });

        Object.keys(uploadedImages).forEach(colorIndex => {
          const index = parseInt(colorIndex);
          if (colors[index]) {
            colors[index].images = [
              ...(colors[index].images || []),
              ...uploadedImages[index]
            ];
          }
        });
      }

      // Prepare final product data
      const productData = {
        productId: data.productId,
        productName: data.productName,
        description: data.description || "",
        categoryId: data.categoryId,
        categoryName: data.categoryName,
        hsnCode: data.hsnCode || "",
        type: "simple",
        modelName: data.modelName || data.productName,
        SKU: data.SKU,
        specifications: data.specifications || [],
        colors: colors,
        models: [],
        thumbnailImage: data.thumbnailImage,
        coverImage: data.coverImage,  // ← NEW FIELD
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      console.log("💾 Saving product to database...");
      console.log("Cover Image:", productData.coverImage || "(none)");

      // Create product
      const product = await Product.create(productData);

      console.log("\n✅ PRODUCT SAVED TO DATABASE:");
      console.log("   Product ID:", product.productId);
      console.log("   Product Name:", product.productName);
      console.log("   Cover Image:", product.coverImage || "(none)");

      // Create inventory entries
      console.log("📊 Creating inventory entries...");
      await createInventoryEntries(product);

      console.log("\n" + "=".repeat(50));
      console.log("✅ PRODUCT ADDED SUCCESSFULLY");
      console.log("=".repeat(50) + "\n");

      res.status(201).json({
        success: true,
        message: "Product added successfully",
        product: product,
      });

    } catch (err) {
      console.error("\n❌ ERROR ADDING PRODUCT:");
      console.error("   Error message:", err.message);
      console.error("   Error stack:", err.stack);

      res.status(500).json({
        success: false,
        error: err.message,
        details: err.stack
      });
    }
  }
);

// ============================================
// 🟡 UPDATE PRODUCT - WITH COVER IMAGE
// ============================================
router.put(
  "/update/:productId",
  adminAuth,
  (req, res, next) => {
    upload.any()(req, res, (err) => {
      if (err) {
        return res.status(400).json({ error: err.message });
      }
      next();
    });
  },
  async (req, res) => {
    try {
      const productId = req.params.productId;
      const data = req.body;
      const files = req.files || [];

      console.log(`📝 Updating product: ${productId}`);

      // Get existing product
      const existingProduct = await Product.findOne({ productId });
      if (!existingProduct) {
        return res.status(404).json({ message: "Product not found" });
      }

      // Always set type to "simple"
      data.type = "simple";

      // Set model name same as product name if not provided
      if (!data.modelName && data.productName) {
        data.modelName = data.productName;
      }

      // Parse JSON fields
      data.specifications = parseField(data.specifications);
      data.models = parseField(data.models);
      data.colors = parseField(data.colors);

      // Ensure colors array exists
      if (!data.colors || data.colors.length === 0) {
        const existingColor = existingProduct.colors && existingProduct.colors.length > 0
          ? existingProduct.colors[0]
          : null;

        data.colors = [{
          colorId: existingColor ? existingColor.colorId : uuidv4(),
          colorName: "Default",
          fragrances: [],
          images: existingColor ? existingColor.images : [],
          originalPrice: data.originalPrice || (existingColor ? existingColor.originalPrice : 0),
          currentPrice: data.currentPrice || (existingColor ? existingColor.currentPrice : 0),
          colorSpecifications: []
        }];
      } else {
        if (data.colors[0]) {
          data.colors[0].colorName = "Default";

          if (!data.colors[0].fragrances) {
            data.colors[0].fragrances = [];
          }

          // Process fragrances
          data.colors[0].fragrances = data.colors[0].fragrances.map(frag => {
            if (typeof frag === 'object' && frag !== null && frag.name) {
              return {
                name: frag.name,
                notes: frag.notes || [],
                topNotes: frag.topNotes || [],
                heartNotes: frag.heartNotes || [],
                baseNotes: frag.baseNotes || []
              };
            } else if (typeof frag === 'string') {
              return {
                name: frag,
                notes: [],
                topNotes: [],
                heartNotes: [],
                baseNotes: []
              };
            }
            return {
              name: "",
              notes: [],
              topNotes: [],
              heartNotes: [],
              baseNotes: []
            };
          }).filter(frag => frag.name && frag.name.trim() !== "");

          if (!data.colors[0].colorId) {
            const existingColor = existingProduct.colors && existingProduct.colors.length > 0
              ? existingProduct.colors[0]
              : null;
            data.colors[0].colorId = existingColor ? existingColor.colorId : uuidv4();
          }
        }
      }

      // Process uploaded files
      const thumbnailFile = files.find(file => file.fieldname === 'thumbnail');
      const coverImageFile = files.find(file => file.fieldname === 'coverImage');
      const colorImages = files.filter(file => file.fieldname.startsWith('colorImages'));

      // Handle THUMBNAIL update
      if (thumbnailFile) {
        data.thumbnailImage = createImageUrl(req, thumbnailFile.filename);
      }

      // ✅ NEW: Handle COVER IMAGE update
      if (coverImageFile) {
        data.coverImage = createImageUrl(req, coverImageFile.filename);
        console.log("✅ Cover Image updated:", data.coverImage);
      } else if (data.coverImage === "" || data.coverImage === null) {
        // If explicitly set to empty, remove cover image
        data.coverImage = "";
      } else {
        // Keep existing cover image if not changed
        data.coverImage = existingProduct.coverImage;
      }

      // Handle color images
      if (colorImages.length > 0 && data.colors) {
        const uploadedImages = {};

        colorImages.forEach(file => {
          const match = file.fieldname.match(/colorImages\[(\d+)\]/);
          if (match) {
            const colorIndex = parseInt(match[1]);
            if (!uploadedImages[colorIndex]) {
              uploadedImages[colorIndex] = [];
            }
            const imageUrl = createImageUrl(req, file.filename);
            uploadedImages[colorIndex].push(imageUrl);
          }
        });

        Object.keys(uploadedImages).forEach(colorIndex => {
          const index = parseInt(colorIndex);
          if (data.colors[index]) {
            data.colors[index].images = [
              ...(data.colors[index].images || []),
              ...uploadedImages[index]
            ];
          }
        });
      }

      // Update timestamp
      data.updatedAt = new Date();

      console.log("💾 Updating product in database...");
      const updated = await Product.findOneAndUpdate(
        { productId },
        { $set: data },
        { new: true, runValidators: true }
      );

      // Update inventory
      console.log("📊 Updating inventory entries...");
      await createInventoryEntries(updated);

      res.json({
        message: "Product updated successfully",
        product: updated,
      });

    } catch (err) {
      console.error("❌ Error updating product:", err);
      res.status(500).json({ error: err.message });
    }
  }
);

// ============================================
// 🔴 DELETE PRODUCT (Soft Delete)
// ============================================
router.delete("/delete/:productId", adminAuth, async (req, res) => {
  try {
    const productId = req.params.productId;

    const product = await Product.findOne({ productId });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const deleted = await Product.findOneAndUpdate(
      { productId },
      { isActive: false, updatedAt: new Date() },
      { new: true }
    );

    await Inventory.updateMany(
      { productId },
      { isActive: false, updatedAt: new Date() }
    );

    res.json({
      message: "Product deactivated successfully",
      product: deleted,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// ============================================
// 🟦 GET ALL ACTIVE PRODUCTS
// ============================================
router.get("/all", async (req, res) => {
  try {
    const products = await Product.find({ isActive: true })
      .sort({ createdAt: 1 });
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// ============================================
// 🟦 GET SINGLE PRODUCT
// ============================================
router.get("/:productId", async (req, res) => {
  try {
    const productId = req.params.productId;
    const product = await Product.findOne({ productId, isActive: true });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// ============================================
// 🟦 GET RELATED PRODUCTS BY FRAGRANCES
// ============================================
router.post("/related-by-fragrances", async (req, res) => {
  try {
    const { productId, fragrances, categoryId, limit = 8 } = req.body;

    console.log("🔍 Finding related products by fragrances:", {
      productId,
      fragrances,
      categoryId,
      limit
    });

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required"
      });
    }

    if (!fragrances || !Array.isArray(fragrances) || fragrances.length === 0) {
      console.log("⚠️ No fragrances provided, falling back to category search");

      const categoryProducts = await Product.find({
        productId: { $ne: productId },
        categoryId,
        isActive: true,
        type: "simple"
      })
        .limit(limit)
        .sort({ createdAt: 1 })
        .lean();

      console.log(`✅ Found ${categoryProducts.length} products in same category`);

      return res.json({
        success: true,
        products: categoryProducts
      });
    }

    const relatedProducts = await Product.find({
      productId: { $ne: productId },
      categoryId,
      isActive: true,
      type: "simple",
      "colors.fragrances.name": { $in: fragrances }
    })
      .limit(limit)
      .sort({ createdAt: 1 })
      .lean();

    console.log(`✅ Found ${relatedProducts.length} products with same fragrances`);

    if (relatedProducts.length >= limit / 2) {
      return res.json({
        success: true,
        products: relatedProducts
      });
    }

    const existingProductIds = [
      productId,
      ...relatedProducts.map(p => p.productId)
    ];

    const additionalProducts = await Product.find({
      productId: { $nin: existingProductIds },
      categoryId,
      isActive: true,
      type: "simple"
    })
      .limit(limit - relatedProducts.length)
      .sort({ createdAt: 1 })
      .lean();

    const allProducts = [...relatedProducts, ...additionalProducts];

    console.log(`✅ Total found: ${allProducts.length} products`);

    res.json({
      success: true,
      products: allProducts
    });

  } catch (error) {
    console.error('❌ Error fetching related products:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// ============================================
// 🟦 GET PRODUCTS BY CATEGORY
// ============================================
router.get("/category/:categoryId/exclude/:productId", async (req, res) => {
  try {
    const { categoryId, productId } = req.params;
    const limit = parseInt(req.query.limit) || 8;

    console.log(`🔍 Getting products from category ${categoryId}, excluding ${productId}`);

    const products = await Product.find({
      categoryId,
      productId: { $ne: productId },
      isActive: true,
      type: "simple"
    })
      .limit(limit)
      .sort({ createdAt: 1 });

    console.log(`✅ Found ${products.length} products`);

    res.json({
      success: true,
      products: products
    });

  } catch (error) {
    console.error('❌ Error fetching category products:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// ============================================
// 🟦 GET PRODUCT BY NAME/SLUG
// ============================================
router.get("/by-name/:productName", async (req, res) => {
  try {
    const productName = req.params.productName;

    console.log("🔍 Searching for product with name:", productName);

    const searchName = productName
      .replace(/-/g, ' ')
      .replace(/[^\w\s]/g, '')
      .trim();

    console.log("🔍 Searching for:", searchName);

    const product = await Product.findOne({
      productName: {
        $regex: new RegExp(`^${searchName}$`, 'i')
      },
      isActive: true
    });

    if (!product) {
      console.log("❌ Product not found with name:", searchName);
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    console.log("✅ Product found:", product.productName, "ID:", product.productId);

    res.json({
      success: true,
      product: product
    });

  } catch (error) {
    console.error('❌ Error finding product by name:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

module.exports = router;