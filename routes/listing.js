const express = require("express");
const router = express.Router();
const Listing = require("../models/listing");

// ✅ Search route (define before :id route)
router.get("/search", async (req, res, next) => {
  try {
    const query = req.query.q || "";

    // Agar tum ward/location/title sab pe search karna chahte ho
    const listings = await Listing.find({
      $or: [
        { location: { $regex: query, $options: "i" } },
        { title: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
      ],
    });

    res.render("listings/index.ejs", { allListings: listings });
  } catch (err) {
    next(err);
  }
});

// ✅ Index route
router.get("/", async (req, res, next) => {
  try {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
  } catch (err) {
    next(err);
  }
});

// ✅ New form
router.get("/new", (req, res) => {
  res.render("listings/new.ejs");
});

// ✅ Show listing by ID
router.get("/:id", async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id)
      .populate({ path: "reviews", populate: { path: "author" } })
      .populate("owner");

    if (!listing) {
      req.flash("error", "Listing you requested for does not exist!");
      return res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing });
  } catch (err) {
    next(err);
  }
});

// ✅ Create listing
router.post("/", async (req, res, next) => {
  try {
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;

    if (req.file) {
      newListing.image = { url: req.file.path, filename: req.file.filename };
    }

    // Example: if using OpenStreetMap geocoding helper
    // const [lat, lon] = await getCoordinates(req.body.listing.location);
    // newListing.latitude = lat;
    // newListing.longitude = lon;

    await newListing.save();
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
  } catch (err) {
    next(err);
  }
});

// ✅ Edit form
router.get("/:id/edit", async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      req.flash("error", "Listing you requested for does not exist!");
      return res.redirect("/listings");
    }

    let originalImageUrl = listing.image.url;
    let originalImageUrl1 = originalImageUrl.replace(
      "/upload",
      "/upload/h_180,w_250"
    );
    res.render("listings/edit.ejs", { listing, originalImageUrl1 });
  } catch (err) {
    next(err);
  }
});

// ✅ Update listing
router.put("/:id", async (req, res, next) => {
  try {
    let listing = await Listing.findByIdAndUpdate(req.params.id, {
      ...req.body.listing,
    });

    if (req.body.listing.location) {
      // const [lat, lon] = await getCoordinates(req.body.listing.location);
      // listing.latitude = lat;
      // listing.longitude = lon;
    }

    if (req.file) {
      listing.image = { url: req.file.path, filename: req.file.filename };
    }

    await listing.save();
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${req.params.id}`);
  } catch (err) {
    next(err);
  }
});

// ✅ Delete listing
router.delete("/:id", async (req, res, next) => {
  try {
    await Listing.findByIdAndDelete(req.params.id);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
  } catch (err) {
    next(err);
  }
});

module.exports = router;
