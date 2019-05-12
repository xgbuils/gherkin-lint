@superfluoustag
Feature: Feature with multiple superfluous example tags

Background:
  Given I have a Background

@tag @superfluoustag
Scenario Outline: This is a Scenario with superfluous example tags
  Then this is a then step
@anothertag @superfluoustag
Examples:
  | foo |
  | bar |
