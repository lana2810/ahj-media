import formatLocation from "../formatLocation";

test.each([
  ["valid with space", "51.50851, -0.12572", ["51.50851", "-0.12572"]],
  ["valid withoutspace", "51.50851,-0.12572", ["51.50851", "-0.12572"]],
  ["valid with brackets", "[51.50851, -0.12572]", ["51.50851", "-0.12572"]],
])("it should be %s", (_, value, expected) => {
  expect(formatLocation(value)).toStrictEqual(expected);
});
