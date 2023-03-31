const { buildQuery, parseRules, parseGroup } = require("../utils/utils");

describe("buildQuery", () => {
  it("should build a query with no rules and empty group", () => {
    const tableName = "test_table";
    const data = { items: [], type: "GROUP" };
    const groupQuery = "()";
    const expectedQuery = `SELECT * from "${tableName}" WHERE ${groupQuery}`;

    const result = buildQuery({ tableName, data });

    expect(result).toBe(expectedQuery);
  });

  it("should throw an error if no tableName is provided", () => {
    const data = { items: [], type: "GROUP" };

    expect(() => buildQuery({ data })).toThrow("Table Names is missing.");
  });

  it("should throw an error if no data is provided", () => {
    const tableName = "test_table";

    expect(() => buildQuery({ tableName })).toThrow();
  });
});

describe("parseRules", () => {
  it("should parse rules and return a query with AND between ", () => {
    const rules = [
      {
        combineOperator: "AND",
        field: "name",
        operator: "eq",
        value: "John",
        type: "RULE",
      },
      {
        combineOperator: "AND",
        field: "age",
        operator: "lt",
        value: 30,
        type: "RULE",
      },
    ];
    const expectedQuery = "name = 'John' AND age < '30'";

    const result = parseRules(rules);

    expect(result).toBe(expectedQuery);
  });

  it("should parse rules and return a query with OR between ", () => {
    const rules = [
      {
        combineOperator: "AND",
        field: "name",
        operator: "eq",
        value: "John",
        type: "RULE",
      },
      {
        combineOperator: "OR",
        field: "age",
        operator: "lt",
        value: 30,
        type: "RULE",
      },
    ];
    const expectedQuery = "name = 'John' OR age < '30'";

    const result = parseRules(rules);

    expect(result).toBe(expectedQuery);
  });

  it("should parse rules and return one rule with no AND or OR at the end.", () => {
    const rules = [
      {
        combineOperator: "AND",
        field: "name",
        operator: "eq",
        value: "John",
        type: "RULE",
      },
    ];
    const expectedQuery = "name = 'John'";

    const result = parseRules(rules);

    expect(result).toBe(expectedQuery);
  });

  it("should throw an error if an unsupported operator is used", () => {
    const operator = "Unsupported operator";
    const rules = [{ field: "name", operator, value: "John", type: "RULE" }];

    expect(() => parseRules(rules)).toThrow(
      `Unsupported operator: ${operator}`
    );
  });
});

describe("parseGroup", () => {
  it("should parse groups and return a query", () => {
    const group = {
      items: [
        {
          combineOperator: "AND",
          field: "name",
          operator: "eq",
          value: "John",
          type: "RULE",
        },
        {
          combineOperator: "AND",
          field: "age",
          operator: "lt",
          value: 30,
          type: "RULE",
        },
      ],
      type: "GROUP",
    };
    const expectedQuery = "(name = 'John' AND age < '30')";

    const result = parseGroup(group);

    expect(result).toBe(expectedQuery);
  });

  it("should handle nested groups", () => {
    const group = {
      type: "GROUP",
      items: [
        {
          combineOperator: "AND",
          field: "name",
          operator: "eq",
          value: "John",
          type: "RULE",
        },
        {
          combineOperator: "AND",
          field: "age",
          operator: "lt",
          value: 30,
          type: "RULE",
        },
        {
          type: "GROUP",
          items: [
            {
              combineOperator: "AND",
              field: "name",
              operator: "eq",
              value: "Marry",
              type: "RULE",
            },
            {
              combineOperator: "AND",
              field: "age",
              operator: "gte",
              value: 40,
              type: "RULE",
            },
          ],
        },
      ],
    };
    const expectedQuery = "(name = 'John' AND age < '30' AND (name = 'Marry' AND age >= '40'))";

    const result = parseGroup(group);

    expect(result).toBe(expectedQuery);
  });

  it("should handle multiple groups", () => {
    const group = {
      type: "GROUP",
      items: [
        {
          combineOperator: "AND",
          field: "name",
          operator: "eq",
          value: "John",
          type: "RULE",
        },
        {
          combineOperator: "AND",
          field: "age",
          operator: "lt",
          value: 30,
          type: "RULE",
        },
        {
          type: "GROUP",
          items: [
            {
              combineOperator: "AND",
              field: "name",
              operator: "eq",
              value: "Marry",
              type: "RULE",
            },
            {
              combineOperator: "AND",
              field: "age",
              operator: "gte",
              value: 40,
              type: "RULE",
            },
          ],
        },
        {
          type: "GROUP",
          items: [
            {
              combineOperator: "AND",
              field: "sex",
              operator: "eq",
              value: "male",
              type: "RULE",
            },
          ],
        },
      ],
    };
    const expectedQuery = "(name = 'John' AND age < '30' AND (name = 'Marry' AND age >= '40') AND (sex = 'male'))";

    const result = parseGroup(group);

    expect(result).toBe(expectedQuery);
  });

  it("should handle 3 depth of nested groups", () => {
    const group = {
      type: "GROUP",
      items: [
        {
          combineOperator: "AND",
          field: "name",
          operator: "eq",
          value: "John",
          type: "RULE",
        },
        {
          combineOperator: "AND",
          field: "age",
          operator: "lt",
          value: 30,
          type: "RULE",
        },
        {
          type: "GROUP",
          items: [
            {
              combineOperator: "AND",
              field: "name",
              operator: "eq",
              value: "Marry",
              type: "RULE",
            },
            {
              combineOperator: "AND",
              field: "age",
              operator: "gte",
              value: 40,
              type: "RULE",
            },
            {
              type: "GROUP",
              items: [
                {
                  combineOperator: "AND",
                  field: "sex",
                  operator: "eq",
                  value: "male",
                  type: "RULE",
                },
              ],
            },
          ],
        },
      ],
    };
    const expectedQuery = "(name = 'John' AND age < '30' AND (name = 'Marry' AND age >= '40' AND (sex = 'male')))";

    const result = parseGroup(group);

    expect(result).toBe(expectedQuery);
  });

});
