import mongoose, { Schema, Document } from 'mongoose';

/**
 * IUser extends Document — this is how Mongoose adds its internal fields
 * (_id, __v, .save(), .remove(), etc.) to our type.
 */
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  membershipId: string;
  role: 'user' | 'admin';
  createdAt: Date;
}

/**
 * Schema defines the "shape" of documents in the users collection.
 * Each field specifies its type, validation rules, and constraints.
 */
const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
    },
    membershipId: {
      type: String,
      required: [true, 'Membership ID is required'],
      unique: true,
      trim: true,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
  },
  {
    // Automatically adds createdAt and updatedAt fields
    timestamps: true,
  }
);

/**
 * mongoose.model() creates a Model from the schema.
 * The model is what you use to create, read, update, delete documents.
 * First argument 'User' → Mongoose looks for/creates a collection named 'users' (lowercase + plural).
 */
const User = mongoose.model<IUser>('User', userSchema);

export default User;
