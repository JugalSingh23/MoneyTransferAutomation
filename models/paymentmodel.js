import pool from '../database.js'

export const InsertReceiver = async (receivername,receiverbankname,receiveracno) => {
    const result = await pool.query("INSERT into receiver (receivername,receiverbankname,receiveracno) VALUES (?,?,?)",[receivername,receiverbankname,receiveracno])
    return result
}