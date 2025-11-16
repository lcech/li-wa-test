# LinkedIn Insight Tag Compliance Issue

Using the [https://business.linkedin.com/marketing-solutions/insight-tag](LinkedIn Insight Tag) introduces a serious compliance risk, since this Third-Party JavaScript solution contains the [https://www.linkedin.com/help/lms/answer/a1377941](Website Actions) feature that tries to automatically collect data from the host website. The issue is that it may accidentaly collect personal data and a mitigation of such risk is extremely hard (and we also need to consider that most of customers don't even know about this risk).

This issue exists as of November 16th, 2025 and I hope LinkedIn will try to fix this as soon as possible.

## What data is collected by Website Actions

The script automatically listens to click events and the related information about the clicked element (funny enough it does not collect any keyboard-activated events), such as:
- clicks on links (including the text of these links!)
- clicks on any link-like elements (anything with a CSS property ``cursor`` set to ``pointer``)
- clicks on elements that cause form submissions

## How can you disable Website Actions

There are only limited ways to disable or prevent this behavior other than not using the solution at all. The only known way to use the solution with this feature disabled, is to ask LinkedIn Support to disable this on their side for a specific ``partner_id``.

The way LinkedIn implemented the feature toggle is also questionable, since this is done via adding the specific ``partner_id`` to the list of disabled IDs within the globaly used [https://snap.licdn.com/li.lms-analytics/insight.min.js](JavaScript library). That means that this update needs to be performed for each requested ``partner_id`` individually by LinkedIn engineering team and deployed to the globally available file.

## How this GitHub repository may help you

This repository contains a [https://lcech.github.io/li-wa-test/](demo website hosted on GitHub Pages) that can:
- load a specific ``partner_id``
- test if it has Website Actions enabled
- showcase what data is collected, if you click any of the contained simulations (link click or form submission)

This demo website also decodes the collected information, since LinkedIn engineering added an obfuscation using simple hashing and compression.

