import pool from '../database.js'

export const InsertSender = async (sendername,sendernumber,senderalternatenumber) => {
    const result = await pool.query("INSERT into sender (sendername,sendernumber,senderalternatenumber) VALUES (?,?,?)",[sendername,sendernumber,senderalternatenumber])
    return result
}

export const GetSenders = async () => {
    const result = await pool.query("Select * from sender")
    return result
}