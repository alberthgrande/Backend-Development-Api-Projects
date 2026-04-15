export const createUser = async (client, { email, password, role_id }) => {
  const { rows } = await client.query(
    `
    INSERT INTO users (email, password, role_id)
    VALUES ($1, $2, $3)
    RETURNING *
    `,
    [email, password, role_id],
  );

  return rows[0];
};

export const findByEmail = async (client, email) => {
  const { rows } = await client.query(`SELECT * FROM users WHERE email = $1`, [
    email,
  ]);

  return rows[0];
};

export const findById = async (client, userId) => {
  const { rows } = await client.query(`SELECT * FROM users WHERE id = $1`, [
    userId,
  ]);

  return rows[0];
};

export const updateUser = async (client, userId, data) => {
  const { email, password } = data;

  const { rows } = await client.query(
    `
    UPDATE users
    SET email = $1, password = $2
    WHERE id = $3
    RETURNING id, email
    `,
    [email, password, userId],
  );

  return rows[0];
};

export const deleteUser = async (client, userId) => {
  const { rowCount } = await client.query(`DELETE FROM users WHERE id = $1`, [
    userId,
  ]);

  return rowCount > 0;
};
