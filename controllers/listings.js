const Listing = require("../models/listing.js");
const axios = require("axios"); // ✅ use axios for HTTP requests

// ✅ Helper function to get coordinates from OpenStreetMap
async function getCoordinates(location) {
  const res = await axios.get("https://nominatim.openstreetmap.org/search", {
    params: {
      q: location,
      format: "json",
      limit: 1,
    },
  });
  if (res.data.length === 0) return [null, null];
  const coords = res.data[0];
  return [coords.lat, coords.lon];
}

module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
};

module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");

  if (!listing) {
    req.flash("error", "Listing you requested for does not exist!");
    return res.redirect("/listings");
  }
  res.render("listings/show.ejs", { listing });
};

module.exports.createListing = async (req, res, next) => {
  try {
    // ✅ Geocode location using OpenStreetMap
    const [lat, lon] = await getCoordinates(req.body.listing.location);

    let url = req.file?.path || "";
    let filename = req.file?.filename || "";

    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = { url, filename };
    newListing.latitude = lat;
    newListing.longitude = lon;

    await newListing.save();
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
  } catch (err) {
    next(err);
  }
};

module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
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
};

module.exports.updateListing = async (req, res, next) => {
  try {
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

    // ✅ Update geocoding if location changed
    if (req.body.listing.location) {
      const [lat, lon] = await getCoordinates(req.body.listing.location);
      listing.latitude = lat;
      listing.longitude = lon;
    }

    // ✅ Update image if new file uploaded
    if (req.file) {
      let url = req.file.path;
      let filename = req.file.filename;
      listing.image = { url, filename };
    }

    await listing.save();
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
  } catch (err) {
    next(err);
  }
};

module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing Deleted!");
  res.redirect("/listings");
};
