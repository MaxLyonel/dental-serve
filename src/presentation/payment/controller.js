const { response } = require('express');
const db = require('../../database/models');

const createPayment = async (req, res = response) => {
  try {
    //encontramos al administrador por el token
    const administratorId = req.uid;
    //regstramos el pago
    const payment = new db.payment(req.body);
    payment.administratorId = administratorId;
    await payment.save();

    return res.json({
      ok: true,
      payment: payment,
      msg: 'pago registrado exitosamente'
    });
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      ok: false,
      msg: 'Por favor hable con el administrador'
    });
  }
}

const updatePayment = async (req, res = response) => {
  const { paymentId } = req.params;
  try {
    //encontramos el pago
    let payment = await db.payment.findByPk(paymentId);
    if (!payment) {
      return res.status(404).json({
        ok: false,
        msg: 'No se encontró el pago',
      });
    }
    //modificamos el pago
    await db.payment.update(
      req.body,
      {
        where: { id: paymentId },
      }
    )
    payment = await db.payment.findByPk(paymentId);
    return res.json({
      ok: true,
      payment: payment,
      msg: 'pago editado exitosamente'
    });
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      ok: false,
      msg: 'Por favor hable con el administrador'
    });
  }
}

const deletePayment = async (req, res = response) => {
  const { paymentId } = req.params;
  try {
    //encontramos el pago
    let payment = await db.payment.findByPk(paymentId);
    if (!payment) {
      return res.status(404).json({
        ok: false,
        msg: 'No se encontró el pago',
      });
    }
    //modificamos el pago
    await db.payment.update(
      { state: false },
      { where: { id: paymentId } }
    );

    payment = await db.payment.findByPk(paymentId);
    return res.json({
      ok: true,
      role: payment,
      msg: 'pago cancelado'
    });
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      ok: false,
      msg: 'Por favor hable con el administrador'
    });
  }
}

module.exports = {
  createPayment,
  updatePayment,
  deletePayment,
}