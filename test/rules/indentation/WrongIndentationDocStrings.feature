Feature: My team is never consistent with anything

Scenario: Quotes are indented 6 spaces
  When I use this docstring:
  """
  This is
  a docstring
  """
  Then the rule should pass

Scenario: Content of Docstring is indente at least 6 spaces
  When I use this docstring:
    """
  This is
        a docstring
    """
  Then the rule should pass
