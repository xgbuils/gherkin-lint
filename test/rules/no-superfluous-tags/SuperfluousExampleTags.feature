@superfluoustag1
Feature: Feature with multiple superfluous example tags

Background:
  Given I have a Background

@tag
Scenario Outline: This is a Scenario with superfluous example tags
  Then this is a then step
@anothertag @superfluoustag1
Examples:
  | foo |
  | bar |

@anothertag @superfluoustag2 @tag
Scenario Outline: This is a Scenario with superfluous example tags
  Then this is a then step <foo>
@footag @superfluoustag2
Examples:
  | foo |
  | bar |
