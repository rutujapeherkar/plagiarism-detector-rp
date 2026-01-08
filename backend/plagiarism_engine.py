"""
Hybrid Code Plagiarism Detection System (API Ready Version)
-------------------------------------------------------------
Modified to accept code inputs dynamically and return structured results
"""

import ast
import torch
import torch.nn.functional as F
from transformers import RobertaTokenizer, RobertaModel
from collections import defaultdict


# ==========================================================
# AST + CFG + CALL GRAPH FEATURE EXTRACTION
# ==========================================================
class StructuralExtractor(ast.NodeVisitor):
    def __init__(self):
        self.features = {
            "functions": 0,
            "calls": 0,
            "returns": 0,
            "ifs": 0,
            "loops": 0,
            "operators": set(),
            "call_graph": defaultdict(set),
            "cfg_nodes": 0
        }
        self.current_function = None

    def visit_FunctionDef(self, node):
        self.current_function = node.name
        self.features["functions"] += 1
        self.features["cfg_nodes"] += 1
        self.generic_visit(node)
        self.current_function = None

    def visit_Call(self, node):
        self.features["calls"] += 1
        if isinstance(node.func, ast.Name) and self.current_function:
            self.features["call_graph"][self.current_function].add(node.func.id)
        self.features["cfg_nodes"] += 1
        self.generic_visit(node)

    def visit_Return(self, node):
        self.features["returns"] += 1
        self.features["cfg_nodes"] += 1
        self.generic_visit(node)

    def visit_If(self, node):
        self.features["ifs"] += 1
        self.features["cfg_nodes"] += 1
        self.generic_visit(node)

    def visit_For(self, node):
        self.features["loops"] += 1
        self.features["cfg_nodes"] += 1
        self.generic_visit(node)

    def visit_While(self, node):
        self.features["loops"] += 1
        self.features["cfg_nodes"] += 1
        self.generic_visit(node)

    def visit_BinOp(self, node):
        self.features["operators"].add(type(node.op).__name__)
        self.generic_visit(node)


def extract_structural_features(code):
    tree = ast.parse(code)
    extractor = StructuralExtractor()
    extractor.visit(tree)
    return extractor.features


def structural_similarity(code1, code2):
    f1 = extract_structural_features(code1)
    f2 = extract_structural_features(code2)

    score = 0
    total = 0

    for key in ["functions", "calls", "returns", "ifs", "loops"]:
        total += 1
        if f1[key] == f2[key]:
            score += 1

    total += 1
    if f1["cfg_nodes"] == f2["cfg_nodes"]:
        score += 1

    total += 1
    if f1["call_graph"] == f2["call_graph"]:
        score += 1

    raw_score = score / total

    if f1["operators"] != f2["operators"]:
        raw_score -= 0.35

    return max(raw_score, 0.0)


# ==========================================================
# BEHAVIOR / INTENT SIGNATURE
# ==========================================================
def behavior_signature(code):
    if "*" in code:
        return "MULTIPLICATION"
    if "+" in code:
        return "ADDITION"
    if "-" in code:
        return "SUBTRACTION"
    if "/" in code:
        return "DIVISION"
    return "OTHER"


# ==========================================================
# CODEBERT SEMANTIC SIMILARITY (DISABLED FOR MEMORY)
# ==========================================================
# Uncomment below if you have enough RAM (2GB+)

# MODEL_NAME = "microsoft/codebert-base"
# tokenizer = RobertaTokenizer.from_pretrained(MODEL_NAME)
# model = RobertaModel.from_pretrained(MODEL_NAME)
# model.eval()


def semantic_similarity(code1, code2):
    """
    Lightweight semantic similarity without CodeBERT
    Uses simple token matching instead
    """
    if behavior_signature(code1) != behavior_signature(code2):
        return 0.0
    
    # Simple token-based similarity
    tokens1 = set(code1.lower().split())
    tokens2 = set(code2.lower().split())
    
    if not tokens1 or not tokens2:
        return 0.0
    
    intersection = len(tokens1 & tokens2)
    union = len(tokens1 | tokens2)
    
    return intersection / union if union > 0 else 0.0


# ==========================================================
# AI-GENERATED CODE PROBABILITY
# ==========================================================
def ai_generated_probability(code):
    score = 0
    lines = len(code.strip().splitlines())
    avg_len = sum(len(l) for l in code.splitlines()) / max(lines, 1)

    if avg_len < 35:
        score += 20
    if code.count("\n") < 8:
        score += 20
    if ";" not in code and "#" not in code:
        score += 20
    if any(v in code for v in ["temp", "result", "total", "value"]):
        score += 20
    if code.strip().startswith("def"):
        score += 20

    if lines < 6:
        score -= 15

    return min(max(score, 0), 100)


# ==========================================================
# DECISION ENGINE
# ==========================================================
def plagiarism_verdict(ast_score, sem_score, intent_match):
    if not intent_match:
        return "ORIGINAL", "Different computational intent"

    if ast_score > 0.75 and sem_score > 0.90:
        return "PLAGIARIZED", "High structural and semantic similarity"

    return "ORIGINAL", "Similarity below plagiarism threshold"


# ==========================================================
# CODE VALIDATION
# ==========================================================
def prevalidate_code(code: str):
    """
    Pre-validation layer for plagiarism system.
    Returns: (is_valid: bool, message: str)
    """
    if not code or not code.strip():
        return False, "Code is empty or contains only whitespace."

    try:
        tree = ast.parse(code)
    except SyntaxError as e:
        return False, f"Syntax Error: {e.msg}"
    except Exception as e:
        return False, f"Parsing failed: {str(e)}"

    has_executable_logic = False
    for node in ast.walk(tree):
        if isinstance(node, (
            ast.FunctionDef,
            ast.AsyncFunctionDef,
            ast.ClassDef,
            ast.For,
            ast.While,
            ast.If,
            ast.Assign,
            ast.Return,
            ast.Call
        )):
            has_executable_logic = True
            break

    if not has_executable_logic:
        return False, "Code has no meaningful executable logic."

    return True, "Code is valid."


# ==========================================================
# MAIN ANALYSIS FUNCTION (API READY)
# ==========================================================
def analyze_plagiarism(program_a: str, program_b: str):
    """
    Main function to analyze plagiarism between two programs.
    Returns a dictionary with all results.
    """
    result = {
        "success": False,
        "error": None,
        "validation": {
            "program1_valid": False,
            "program2_valid": False,
            "program1_message": "",
            "program2_message": ""
        },
        "analysis": None
    }

    # Validate both programs
    is_valid_a, message_a = prevalidate_code(program_a)
    is_valid_b, message_b = prevalidate_code(program_b)

    result["validation"]["program1_valid"] = is_valid_a
    result["validation"]["program2_valid"] = is_valid_b
    result["validation"]["program1_message"] = message_a
    result["validation"]["program2_message"] = message_b

    if not is_valid_a or not is_valid_b:
        errors = []
        if not is_valid_a:
            errors.append(f"Program 1: {message_a}")
        if not is_valid_b:
            errors.append(f"Program 2: {message_b}")
        result["error"] = " | ".join(errors)
        return result

    # Perform plagiarism analysis
    try:
        ast_score = structural_similarity(program_a, program_b)
        sem_score = semantic_similarity(program_a, program_b)
        intent_match = behavior_signature(program_a) == behavior_signature(program_b)
        verdict, reason = plagiarism_verdict(ast_score, sem_score, intent_match)
        ai_a = ai_generated_probability(program_a)
        ai_b = ai_generated_probability(program_b)

        result["success"] = True
        result["analysis"] = {
            "ast_score": round(ast_score, 4),
            "semantic_score": round(sem_score, 4),
            "intent_match": intent_match,
            "verdict": verdict,
            "reason": reason,
            "ai_probability": {
                "program1": round(ai_a, 2),
                "program2": round(ai_b, 2)
            },
            "similarity_percentage": round((ast_score * 0.5 + sem_score * 0.5) * 100, 2)
        }

    except Exception as e:
        result["error"] = f"Analysis failed: {str(e)}"

    return result