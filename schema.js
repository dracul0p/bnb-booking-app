const Joi = require('joi');

module.exports.listingSchema = Joi.object({
    listing: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        image: Joi.object({
            filename: Joi.string().default(""),
            url: Joi.string().uri().default("https://images.unsplash.com/photo-1625505826533-5c80aca7d157?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGdvYXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60"),
        }).required(),
        price: Joi.number().min(0).required().min,
        location: Joi.string().required(),
        country: Joi.string().required(),
    }).required(),
});


module.exports.reviewSchema = Joi.object({
    review :Joi.object({
       rating : Joi.number().required().min(1).max(5),
       comment: Joi.string().required()
    }).required()
})
