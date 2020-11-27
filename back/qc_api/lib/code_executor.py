""" Defensive code executor class to wrap user code execution. """
from copy import copy
from traceback import print_exc
from typing import Dict, Any


class DefensiveCodeExecutor:
    """
    An executor for executing user code. All its methods are static because it needs not to be instantiated.
    """
    def __init__(self):
        """ init function"""
        return

    @classmethod
    def pre_validate(cls, code: str) -> None:
        """
        Test invalid string occurrences before executing user code.
        Parameters:
            code: code in a string format
        Invalid keywords: import, exec, raise
        """
        assert "import" not in code
        assert "exec(" not in code
        # assert "print" not in code
        assert "raise" not in code
        assert "try" not in code
        assert "except" not in code
        assert "class " not in code
        assert "assert " not in code
        assert "__dict__()" not in code

    @classmethod
    def execute(cls, code: str, accessible_src: Dict[str, Any], accessible_vars: Dict[str, Any]) -> Dict[str, Any]:
        """
        Run pre-validated user code.
        Parameters:
            code: user code in a string format.
            accessible_src: source modules, classes, and functions which user code can have access to.
            accessible_vars: variables which user code can have access to.
        Returns:
            An updated accessible_vars. If post-validation fails, then returns un-updated accessible_vars.
        """
        before_exec = copy(accessible_vars)
        try:
            exec(code, accessible_src, accessible_vars)
        except Exception as exception:
            print(f"exception occurred. {exception}")
            return before_exec
            # print_exc()
        can_return = DefensiveCodeExecutor.post_validate(before=before_exec, after=accessible_vars)
        if can_return:
            return accessible_vars
        return before_exec

    @classmethod
    def post_validate(cls, before: Dict[str, Any], after: Dict[str, Any]) -> bool:
        """
        Checks the changes done by the user code.
        Parameters:
            before: information about shared variables before executing user code.
            after: information about shared variables after executing user code.
        Returns:
            True if the test passes.
        """
        before_keys = before.keys()
        after_keys = after.keys()

        # code execution must not erase the existing keys
        if not set(before_keys).issubset(set(after_keys)):
            return False
        # variable type checking
        for key in before_keys:
            if not isinstance(after[key], type(before[key])):
                return False
            if isinstance(after[key], list) and len(after[key]) > 0:
                first_elm = after[key][0]
                if not all(isinstance(elm, type(first_elm)) for elm in after[key]):
                    return False
        # are there any other checking methods?
        return True
