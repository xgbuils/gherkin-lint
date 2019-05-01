Feature: Feature without tags

Background:
  Given I have a Background

Scenario: This is a Scenario without tags
  Then this is a then step

Scenario Outline: This is a Scenario Outline without tags
  Then this is a then step <foo>
Examples:
  | foo |
  | bar |
