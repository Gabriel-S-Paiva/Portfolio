export const createLead = async (req, res, next) => {
  const { id_painel, nome_cidadao, contacto_cidadao, rgpd, id_pedido, id_item, pin_entrega, id_locker } = req.body;
  const missingFields = [];

  if (!nome_cidadao) missingFields.push("nome_cidadao");
  if (!contacto_cidadao) missingFields.push("contacto_cidadao");
  if (!id_pedido) missingFields.push("id_pedido");
  if (!id_item) missingFields.push("id_item");
  if (!pin_entrega) missingFields.push("pin_entrega");

  if (missingFields.length) {
    return next(missingFieldError(missingFields));
  }

  const transaction = await Leads.sequelize.transaction();

  try {
    if (id_painel) {
      const panel = await Panels.findByPk(id_painel);
      if (!panel) {
        await transaction.rollback();
        return next(notFoundError("Panel", id_painel));
      }
    }

    let citizen = await Citizens.findOne({ where: { contacto: contacto_cidadao }, transaction });
    if (!citizen) {
      if (rgpd === undefined || rgpd === null) {
        await transaction.rollback();
        return next(missingFieldError(["rgpd"]));
      }
      citizen = await Citizens.create(
        { nome: nome_cidadao, contacto: contacto_cidadao, rgpd, blocked: 0 },
        { transaction }
      );
    }

    if (citizen.blocked) {
      await transaction.rollback();
      return next(conflictError([{ contacto_cidadao: "Citizen is suspended and cannot participate in leads" }]));
    }

    const needItem = await NeedItem.findByPk(id_item);
    if (!needItem) {
      await transaction.rollback();
      return next(notFoundError("NeedItem", id_item));
    }
    if (needItem.id_pedido !== id_pedido) {
      await transaction.rollback();
      return next(validationError([{ id_item: "Item does not belong to provided pedido" }]));
    }

    // An EXPIRADO lead releases the item back to the panel; only PENDENTE or
    // ENTREGUE leads block a new request for the same item.
    const activeLead = await Leads.findOne({
      where: { id_item, estado: ["PENDENTE", "ENTREGUE"] },
      transaction,
    });
    if (activeLead) {
      await transaction.rollback();
      return next(conflictError([{ id_item: "A lead already exists for this item" }]));
    }

    if (id_locker) {
      const locker = await Lockers.findByPk(id_locker);
      if (!locker) {
        await transaction.rollback();
        return next(notFoundError("Locker", id_locker));
      }
    }

    const lead = await Leads.create(
      {
        id_painel: id_painel || null,
        nome_cidadao,
        contacto_cidadao,
        id_pedido,
        id_item,
        item_pedido: needItem.tipo_bem_servico,
        pin_entrega,
        id_locker: id_locker || null,
      },
      { transaction }
    );

    await transaction.commit();
