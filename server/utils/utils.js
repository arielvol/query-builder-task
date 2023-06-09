const { faker } = require("@faker-js/faker");

function buildQuery(queryData) {
  const { tableName, data } = queryData;

  if (!tableName) {
    throw new Error(`Table Names is missing.`);
  }

  if (!data) {
    throw new Error(`Query data is missing.`);
  }

  let query = `SELECT * from "${tableName}" WHERE `;

  const groupQuery = parseGroup(data)
  query += groupQuery;

  return query;
}

function parseRules(rules) {
  let query = "";

  const conditions = [];
  rules.forEach((rule, index) => {
    const { field, operator, value } = rule;
    let condition;

    switch (operator) {
      case "eq":
        condition = `${field} = '${value}'`;
        break;
      case "neq":
        condition = `${field} <> '${value}'`;
        break;
      case "lt":
      case "before":
        condition = `${field} < '${value}'`;
        break;
      case "lte":
        condition = `${field} <= '${value}'`;
        break;
      case "gt":
      case "after":
        condition = `${field} > '${value}'`;
        break;
      case "gte":
        condition = `${field} >= '${value}'`;
        break;
      case "contains":
        condition = `${field} LIKE '%${value}%'`;
        break;
      case "notcontains":
        condition = `${field} NOT LIKE '%${value}%'`;
        break;
      case "startswith":
        condition = `${field} LIKE '${value}%'`;
        break;
      case "endswith":
        condition = `${field} LIKE '%${value}'`;
        break;
      case "in":
        condition = `${field} IN (${value.map((v) => `'${v}'`).join(", ")})`;
        break;
      case "notin":
        condition = `${field} NOT IN (${value
          .map((v) => `'${v}'`)
          .join(", ")})`;
        break;
      case "between":
        const [start, end] = value;
        condition = `${field} BETWEEN '${start}' AND '${end}'`;
        break;
      default:
        throw new Error(`Unsupported operator: ${operator}`);
    }
    conditions.push(condition);
    const nextIndex = index + 1;
    if (rules[nextIndex] && rules[nextIndex].combineOperator) {
      conditions.push(` ${rules[nextIndex].combineOperator} `);
    }
  });
  const joinedConditions = conditions.join("");
  query += joinedConditions;
  return query;
}

function parseGroup(group) {
    let query = "(";

    const rules = group.items.filter((item) => item.type === "RULE");
    const groups = group.items.filter((item) => item.type === "GROUP");

    let rulesQuery = "";
    if (rules && rules.length > 0) {
        rulesQuery = parseRules(rules);
    }
    if (rulesQuery && groups && groups.length > 0) {
        rulesQuery += " AND ";
    }
    query += rulesQuery;


    for (const [index, group] of groups.entries()) {
        query += parseGroup(group);
        if (groups.length > 1 && index != groups.length - 1) {
            query += ' AND ';
        }
    }

    query += ")";

    return query;
}

async function generateEmployeeDummyData(count) {
  const data = [];
  for (let i = 0; i < count; i++) {
    const first_name = faker.name.firstName();
    const last_name = faker.name.lastName();
    const email = faker.internet.email(first_name, last_name);
    const cell_phone = faker.phone.number();
    const home_phone = faker.phone.number();
    const address = faker.address.streetAddress();
    const id_number = faker.datatype.uuid();
    const sex = faker.name.sexType();
    const birthday = faker.date.birthdate();
    const age = calculateAge(birthday);
    data.push({
      first_name,
      last_name,
      email,
      cell_phone,
      home_phone,
      address,
      id_number,
      sex,
      birthday,
      age,
    });
  }
  return data;
}

function calculateAge(birthdayDate) {
  const birthDate = new Date(birthdayDate);
  const currentDate = new Date();
  const diff = currentDate - birthDate;
  const ageInMilliseconds = new Date(diff).getUTCFullYear() - 1970;
  return Math.floor(ageInMilliseconds);
}

async function populateEmployeeTable(count, employeeModelClass) {
  const data = await generateEmployeeDummyData(count);
  await employeeModelClass.bulkCreate(data);
}

module.exports = {
  buildQuery,
  populateEmployeeTable,
  parseGroup,
  parseRules,
};
