"""Regression coverage for ambiguous and irregular source-outline tables."""
from pathlib import Path
import tempfile
import unittest
import xml.etree.ElementTree as ET
import zipfile

from extract_curriculum_outline import extract_outline
from extract_gamer_icu import ISLAND_BY_NUMBER

WORD = "http://schemas.openxmlformats.org/wordprocessingml/2006/main"
HEADERS = ["status", "Topic", "Strategy", "Time (min)", "PEEP Points", "Notes:"]


def paragraph(parent, text):
    node = ET.SubElement(parent, f"{{{WORD}}}p")
    run = ET.SubElement(node, f"{{{WORD}}}r")
    ET.SubElement(run, f"{{{WORD}}}t").text = text


def source_document(path, replacements):
    document = ET.Element(f"{{{WORD}}}document")
    body = ET.SubElement(document, f"{{{WORD}}}body")
    for island_id in ISLAND_BY_NUMBER.values():
        paragraph(body, island_id.replace("-", " ").title())
        headers, activity_rows, totals = replacements.get(island_id, (
            HEADERS,
            [["", "Source lesson", "Video", "10", "3", ""]],
            ["", "TOTAL: 1 activities (compliance = 1)", "", "10", "3", ""],
        ))
        table = ET.SubElement(body, f"{{{WORD}}}tbl")
        for cells in [headers, *activity_rows, totals]:
            row = ET.SubElement(table, f"{{{WORD}}}tr")
            for text in cells:
                cell = ET.SubElement(row, f"{{{WORD}}}tc")
                for line in text.split("\n"):
                    paragraph(cell, line)
    with zipfile.ZipFile(path, "w") as archive:
        archive.writestr("word/document.xml", ET.tostring(document))


class OutlineExtractionTest(unittest.TestCase):
    def setUp(self):
        directory = tempfile.TemporaryDirectory()
        self.addCleanup(directory.cleanup)
        self.path = Path(directory.name) / "GameOutline.docx"

    def test_shifted_status_columns_and_repeat_values_are_not_invented(self):
        source_document(self.path, {"interlobar-divides": (
            ["App dev", "Creation status", *HEADERS[1:]],
            [["pending", "marked", "Determining compliance", "Quest (available to do x2) #2, #3", "15 (30)", "5 (10)", "Observe with RT"]],
            ["", "", "TOTAL: 1 activities (compliance = 1)", "", "30", "10", ""],
        )})
        roster = extract_outline(self.path)
        island = roster["islands"][1]
        self.assertEqual(len(island["activities"]), 1)
        activity = island["activities"][0]
        self.assertEqual(activity["title"], "Determining compliance")
        self.assertEqual(activity["sourceStatus"], {"App dev": "pending", "Creation status": "marked"})
        self.assertEqual(activity["explicitRepeatCount"], 2)
        self.assertIsNone(activity["estimatedMinutes"])
        self.assertIsNone(activity["peepPoints"])
        self.assertIsNone(island["computedRowTotals"]["estimatedMinutes"])
        numeric_issues = [issue for issue in roster["issues"] if issue["code"] == "ambiguous_numeric_value"]
        self.assertEqual({issue["observed"] for issue in numeric_issues}, {"15 (30)", "5 (10)"})

    def test_mixed_strategy_and_unheaded_note_survive_for_review(self):
        source_document(self.path, {"valley-of-pulmonara": (
            HEADERS,
            [["", "VAP", "Reading/Graphic (old- discarded)\nVideo (new)", "10", "2", "First note", "Additional source note"]],
            ["", "TOTAL: 1 activities (compliance = 1)", "", "10", "2", ""],
        )})
        roster = extract_outline(self.path)
        activity = roster["islands"][2]["activities"][0]
        self.assertIsNone(activity["activityType"])
        self.assertEqual(activity["strategy"], "Reading/Graphic (old- discarded)\nVideo (new)")
        self.assertEqual(activity["notes"], ["First note", "Additional source note"])
        self.assertEqual({issue["code"] for issue in roster["issues"]}, {"ambiguous_activity_type", "unmapped_source_column"})

    def test_inconsistent_totals_do_not_create_or_drop_activities(self):
        source_document(self.path, {"bronchial-bluffs": (
            HEADERS,
            [["", "Troubleshooting ineffective BVM", "Quiz", "10", "3", ""]],
            ["", "TOTAL: 2 activities (compliance = 1)", "", "15", "4", ""],
        )})
        roster = extract_outline(self.path)
        island = roster["islands"][3]
        self.assertEqual([activity["title"] for activity in island["activities"]], ["Troubleshooting ineffective BVM"])
        self.assertEqual(island["declaredTotals"]["activityCount"], 2)
        self.assertEqual(island["computedRowTotals"], {"activityCount": 1, "estimatedMinutes": 10, "peepPoints": 3})
        self.assertEqual({issue["field"] for issue in roster["issues"]}, {"activityCount", "estimatedMinutes", "peepPoints"})


if __name__ == "__main__":
    unittest.main()
