Feature: Feature with example homogenous tags

Background:
  Given I have a Background

@tag1
Scenario: This is a Scenario
  Then this is a then step

@tag3
Scenario Outline: This is a Scenario Outline with the same tags
  Then this is a then step <foo>
@tag2
Examples:
  | foo |
  | bar |
@tag2
Examples:
  | foo |
  | rab |
