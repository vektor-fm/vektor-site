# Jev trading workflow: the setup outline

Vektor NO.063 · HFT · 2026-10-04

This is the setup outline and official tool links promised in the film. It explains a prototype architecture: exchange data → market snapshot → Jev judgments → code-controlled order decisions. The sample prices, quantities and answers are synthetic. HFT suitability, latency, market accuracy, live exchange execution and profitability are unverified. This resource is not a ready-to-trade bot or a validated trading strategy.

## What each part owns

| Part | Input | Output | Responsibility |
|---|---|---|---|
| Feed adapter | Your exchange's documented feed | Normalized snapshot | Preserve sequence, timestamps, instrument, prices and quantities. |
| Jev adapter | Snapshot and typed questions | Structured judgments | Ask narrowly scoped questions; keep each judgment inspectable. |
| Application code | Snapshot, answers and account state | Proposed action | Calculate prices, check limits and decide whether to cancel, submit or do nothing. |

The model does not own an exchange connection, account permissions or your execution rules. This boundary is the architecture illustrated in the film, not an implemented integration.

## 1. Start with a recorded or synthetic snapshot

Use [illustrative-snapshot.json](./illustrative-snapshot.json) to inspect the shape before connecting any feed. It matches the film's starting example: best bid 99, best ask 101, midpoint 100, waiting buy size 3 and waiting sell size 4. Those are arbitrary example units, authored by Vektor on 2026-10-04; they are not market observations.

For a real adapter, consult your chosen exchange's current official documentation. Record its instrument, tick and lot sizes, units, sequence identifier, event timestamp and your receive timestamp. A missing update, old snapshot or inconsistent unit should prevent a new order decision. This outline provides no exchange adapter or account credentials.

A single static book snapshot cannot establish who is informed or why a burst occurred. Testing the film's buying-burst question requires an appropriate trade/history window and reliable labels. The sample request remains a prompt experiment until that evidence exists.

## 2. Set up the Jev adapter

[TypeSafe's quick start](https://docs.typesafe.ai/introduction/quickstart) lists its Playground and SDK setup. Its Python instructions currently require Python 3.10 or later and install with `pip install typesafe-sdk`; the client reads `TYPESAFE_API_KEY` from your environment. Check the live documentation before installing. No key, paid call or account login is included or executed by this resource. [SDK reference](https://docs.typesafe.ai/sdk).

[illustrative-request.json](./illustrative-request.json) contains the example state and two independent Choice questions. It follows the documented `state`, `model`, `questions` request structure, with `jev-latest` as the model alias. This file is inspected JSON, not a recorded successful API response. [HTTP API](https://docs.typesafe.ai/api).

Fixed options make answers easier for code to consume. The sample asks about the character of the buying burst and the visible price pressure. The prompts and criteria are Vektor's unvalidated examples. In a real application, supply the evidence each question needs and define what to do when it is insufficient. [Choice documentation](https://docs.typesafe.ai/primitives/choice).

## 3. Keep the action policy in your code

Start by logging proposed decisions in a replay or paper environment. This outline deliberately supplies no live-order command. A possible application flow, proposed here for inspection, is:

```text
Validate snapshot identity, age, units and completeness.
Attach Jev answers to that same snapshot identifier.
Reject missing, malformed, late or stale answers.
Calculate proposed quotes using your separately tested policy.
Check account, inventory and order limits in application code.
Log cancel / submit / no-action proposal in the paper environment.
Record the reason, timestamps and any rejected decision.
```

The quote formula, thresholds, maximum inventory, age limit and order sizing are not supplied or validated. A network timeout or retry must not accidentally create a duplicate live order. These are implementation questions to resolve before an exchange integration; the film is an explanation of the boundary.

## 4. Read confidence correctly

Choice confidence summarizes how concentrated the model's option distribution is. In the film's **illustrative two-option** example, probabilities 0.70 / 0.30 imply confidence `(0.70 - 0.50) / (1 - 0.50) = 0.40`. That is arithmetic from the [official confidence formula](https://docs.typesafe.ai/confidence), checked 2026-10-04; it is not an API result, market accuracy or a 70% chance of making money. Thresholds require testing on your own task and data.

## 5. What must be established before claiming HFT

- Measure the whole path: feed arrival, snapshot creation, model request and response, policy, risk checks, exchange submission and acknowledgement. No end-to-end latency has been measured here.
- Test judgment quality on held-out market data with time ordering preserved. Separate predictive usefulness from the model's reported certainty.
- Evaluate fees, spread, queue position, slippage, stale data and partial fills in an appropriate simulation. A proposed order is not a fill or profit.
- Verify the chosen exchange's message limits, instrument rules, account permissions, cancellation behavior and failure recovery with its official docs. No exchange-specific compatibility is established here.
- Require a separately reviewed execution policy and operational controls before any live deployment. This resource offers no live trading instructions or credentials.

## Official tools and further reading

- [TypeSafe introduction](https://docs.typesafe.ai/introduction): what Jev and typed questions do.
- [Quick start](https://docs.typesafe.ai/introduction/quickstart): Playground, API and Python setup.
- [Client SDKs](https://docs.typesafe.ai/sdk): SDK documentation.
- [API reference](https://docs.typesafe.ai/api): request and response contract.
- [Choice](https://docs.typesafe.ai/primitives/choice): option-based questions.
- [Confidence](https://docs.typesafe.ai/confidence): uncertainty interpretation and formulas.

All six documentation pages were opened and checked on 2026-10-04. Their contents are vendor interface documentation, not independent evidence of trading performance. No API or exchange call was made.

Trading-workflow concept: [@raycfu / Rui Fu's reference reel](https://www.instagram.com/p/DeAr43JPbqv/). This outline and its synthetic example are Vektor's. Follow [@vektor.fm](https://www.instagram.com/vektor.fm/) for more AI systems you can build.
