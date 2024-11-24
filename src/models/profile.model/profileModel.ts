import mongoose, { Document, Schema, Model } from 'mongoose';

// Interface for the UserProfile document
interface IUserProfile extends Document {
  _id: string;
  userId: string;
  email: string;
  name: string;            // Changed from fullName to match form data
  username: string;
  image: string | null;    // Changed from profilePicture to match form data
  bio?: string;
  location: string;       // Added from form data
  website?: string;       // Added from form data
  createdAt: Date;
  updatedAt: Date;
}

const ProfileSchema = new Schema<IUserProfile>(
  {
    userId: { 
      type: String, 
      required: true, 
      unique: true,
      trim: true 
    },
    email: { 
      type: String, 
      required: true, 
      unique: true,
      trim: true,
      lowercase: true
    },
    name: {               // Changed from fullName
      type: String, 
      required: true,
      trim: true,
      maxlength: 50 
    },
    username: { 
      type: String, 
      required: true, 
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 30
    },
    image: {              // Changed from profilePicture
      type: String,
      default: null,
      trim: true 
    },
    bio: { 
      type: String,
      maxlength: 500,
      trim: true 
    },
    location: {           // Added from form data
      type: String,
      trim: true,
      required: true
    },
    website: {            // Added from form data
      type: String,
      trim: true,
      validate: {
        validator: function(v: string) {
          // Basic URL validation
          return !v || /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/.test(v);
        },
        message: 'Please enter a valid URL'
      }
    }
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function(doc, ret) {
        delete ret.__v;
        return ret;
      }
    }
  }
);

// Indexes
ProfileSchema.index({ email: 1 });
ProfileSchema.index({ userId: 1 });
ProfileSchema.index({ username: 1 });

// URL validation middleware
ProfileSchema.pre('save', function(next) {
  const profile = this;
  if (profile.website === '') {
    profile.website = undefined;
  }
  next();
});

// Model creation with error handling
let UserProfile: Model<IUserProfile>;
try {
  UserProfile = mongoose.model<IUserProfile>('UserProfile');
} catch {
  UserProfile = mongoose.model<IUserProfile>('UserProfile', ProfileSchema);
}

export { UserProfile };