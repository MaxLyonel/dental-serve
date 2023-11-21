const { response } = require('express');
const db = require('../../database/models');
const { omit } = require("lodash");
const generatePdf = require('./../../config/generatePdf');

const getPayment = async (paymentId) => {
  const payment = await db.payment.findByPk(paymentId, {
    include: [
      {
        model: db.treatment,
        include: [
          {
            model: db.patient,
            include: [
              { model: db.user }
            ]
          },
          {
            model: db.payment,
          }
        ]
      },
      {
        model: db.administrator,
        include: [
          { model: db.user }
        ]
      }
    ],
  });
  return ({
    ...omit(payment.toJSON(), ['updatedAt']),
  });
}

const createPayment = async (req, res = response) => {
  try {
    //encontramos al administrador por el token
    const administratorId = req.uid;
    //regstramos el pago
    const newPayment = new db.payment(req.body);
    newPayment.administratorId = administratorId;
    await newPayment.save();
    //obtenemos la informacion del pago
    const payment = await getPayment(newPayment.id);

    const body = {
      customer: {
        name: `${payment.treatment.patient.user.name} ${payment.treatment.patient.user.lastName}`,
        identityCard: payment.treatment.patient.user.identityCard
      },
      user: {
        name: `${payment.administrator.user.name} ${payment.administrator.user.lastName}`
      },
      reason: payment.treatment.description,
      date: payment.createdAt,
      amount: payment.amount,
      discount: payment.discount,
      correlative: payment.id,

    }
    console.log(body)
    const { pdfBase64 } = await generatePdf(body);
    return res.json({
      ok: true,
      payment: newPayment,
      amountDue: payment.treatment.totalAmount - ([...payment.treatment.payments.map(payment => payment.amount)].reduce((amount, number) => amount + number, 0)),
      msg: 'pago registrado exitosamente',
      document: pdfBase64
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