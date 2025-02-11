const Listing = require("../models/listing.js");
const axios = require('axios');
module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index", { allListings });
};

module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner");
   
    if (!listing) {
    req.flash("error", "Listing you requested for does not exist!");
    res.redirect("/listings");
  }
 // console.log(listing);
  res.render("listings/show", { listing });
};

/*
module.exports.createListing = async (req, res, next) => {
  let url  = req.file.path;
  let filename = req.file.filename;

  // console.log(url , ".." , filename);
  

  //   let result = listingSchema.validate(req.body);
  // let {title , description , image, price , country , locaion} = req.body;
  
  
  // if (!req.body.listing) {
  //   throw new ExpressError(400, "Send valid data for listing");
  // }

  let newListing = new Listing(req.body.listing); //inserting as instance  in model
  newListing.image = {url ,filename };
  newListing.owner = req.user._id;
  await newListing.save();
  req.flash("success", "New Listing Created");
  res.redirect("/listings");
};  */


module.exports.createListing = async (req, res, next) => {
  try {
    // Get the uploaded file information
    let url = req.file.path;
    let filename = req.file.filename;

    // Get the location entered in the form
    let { title, description, price, country, location } = req.body.listing;

    // Nominatim API endpoint for geocoding
    const geocodeUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
      location
    )}&format=json&addressdetails=1`;

    // Send a GET request to the Nominatim API
    const response = await axios.get(geocodeUrl);

    if (response.data.length > 0) {
      const { lat, lon } = response.data[0];

      // Log the coordinates
      // console.log(`Coordinates for ${location}: Latitude = ${lat}, Longitude = ${lon}`);

      // Create a new listing with the geocoded data (in GeoJSON format)
      let newListing = new Listing({
        title,
        description,
        price,
        country,
        location,
        geometry: {
          type: "Point",
          coordinates: [parseFloat(lon), parseFloat(lat)], // GeoJSON format
        },
        image: { url, filename },
        owner: req.user._id, // Assuming user authentication
      });

      // Save to the database
      const savedListing = await newListing.save();
      // console.log(savedListing);
      

      req.flash("success", "New Listing Created");
      res.redirect("/listings");
    } else {
      throw new Error("Geocoding failed. Could not find location.");
    }
  } catch (error) {
    console.error(error);
    req.flash("error", "Failed to create listing due to geocoding issues.");
    res.redirect("/listings");
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
 
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_200,h_100,c_fill");
 

  res.render("listings/edit.ejs", { listing, originalImageUrl });
};



module.exports.updateListing = async (req, res) => {
   
    // if (!req.body.listing) {
    //     throw new ExpressError(400, "Send valid data for listing");
    //   }

    let { id } = req.params;

  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  if(typeof req.file != "undefined"){ 
  let url  = req.file.path;
  let filename = req.file.filename;
  listing.image = {url , filename };
  await listing.save();
  }

  req.flash("success", "Listing Updated!");
  res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    // console.log(deletedListing);
    req.flash("success", "Listing Deleted!");
    res.redirect(`/listings`);
}