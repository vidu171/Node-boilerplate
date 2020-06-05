import { Document } from 'mongoose'

export interface User extends Document {
    firstName: string
    middleName: string
    lastName: string
    email: string
    companyName: string
    profileImage: string
    userType: number
    smsSenderID: string
    isFirstTime: boolean
    password: string
    alternateEmail: string
    activeStatus: boolean
    greeting: string
}
