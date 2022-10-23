import mongoose from 'mongoose'
import { Password } from '../services/password';

//interface describing properties that describe requirements
//for creating a new User document in Mongo 
interface UserAttrs {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    address1: string;
    address2: string;
    city: string;
    state: string;
    zip: string;
}

//interface that describes the properties that a user document (ie record) in Mongo has
interface UserDoc extends mongoose.Document {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    address1: string;
    address2: string;
    city: string;
    state: string;
    zip: string;
}


//Interface that describes properties & methods that a user model has
interface UserModel extends mongoose.Model<UserDoc> {
    build(attrs: UserAttrs): UserDoc;
}



const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true,
        default: ''
    },
    lastName: {
        type: String,
        required: true,
        default: ''
    },
    address1: {
        type: String,
        required: true,
        default: ''
    },
    address2: {
        type: String,
        required: false,
        default: ''
    },
    city: {
        type: String,
        required: true,
        default: ''
    },
    state: {
        type: String,
        required: true,
        default: ''
    },
    zip: {
        type: String,
        required: true,
        default: ''
    },
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id
            delete ret._id
            delete ret.password;
            delete ret.__v;
        }
    }
});

userSchema.pre('save', async function (done) {

    if (this.isModified('password')) {
        const hashed = await Password.toHash(this.get('password'))
        this.set('password', hashed)
    }

    done();
})

userSchema.statics.build = (attrs: UserAttrs) => {
    return new User(attrs)
}

const User = mongoose.model<UserDoc, UserModel>('User', userSchema)


export { User }