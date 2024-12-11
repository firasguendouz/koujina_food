const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PlateSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true,
        default: ''
    },
    photo: {
        type: String,
        trim: true,
        default: '' // URL of the plate's photo
    },
    ingredients: [
        {
            supplementId: { type: Schema.Types.ObjectId, ref: 'Supplement', required: true },
            name: { type: String, required: true },
            quantity: { type: Number, required: true }, // Quantity required in grams or units
            unit: { type: String, enum: ['grams', 'units', 'ml'], default: 'grams' }
        }
    ],
    price: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        enum: ['starter', 'main course', 'dessert', 'beverage'],
        required: true
    },
    preparationTime: {
        type: Number,
        required: true // Estimated time in minutes
    },
    status: {
        type: String,
        enum: ['available', 'unavailable', 'discontinued'],
        default: 'available'
    },
    chef: {
        type: Schema.Types.ObjectId,
        ref: 'Chef',
        required: true
    },
    popularity: {
        type: Number,
        default: 0 // Tracks the number of times the plate has been ordered
    },
    nutrition: {
        calories: { type: Number, default: 0 },
        protein: { type: Number, default: 0 }, // In grams
        fat: { type: Number, default: 0 }, // In grams
        carbohydrates: { type: Number, default: 0 } // In grams
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date
    }
});

// Static Methods
PlateSchema.statics.increasePopularity = async function(plateId) {
    const plate = await this.findById(plateId);
    if (plate) {
        plate.popularity += 1;
        await plate.save();
    }
};

// Instance Methods
PlateSchema.methods.markAsUnavailable = function() {
    this.status = 'unavailable';
    return this.save();
};

PlateSchema.methods.markAsAvailable = function() {
    this.status = 'available';
    return this.save();
};

PlateSchema.methods.markAsDiscontinued = function() {
    this.status = 'discontinued';
    return this.save();
};

// Pre-save Hook to Update Timestamp
PlateSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Plate', PlateSchema);
