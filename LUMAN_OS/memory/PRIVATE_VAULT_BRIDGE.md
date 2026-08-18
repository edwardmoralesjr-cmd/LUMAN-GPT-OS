# LUMAN Private Vault Bridge

## Purpose

Define how the public LUMAN OS interacts with an authorized private memory source without copying private contents into the public repository.

## Logical Alias

```text
LUMAN_PRIVATE_SOURCE
```

The physical private repository or local vault is resolved through the connected source layer rather than hard-coded into public documentation.

## Public Brain May Know

- whether a private source exists
- whether relevant private context is available
- a public-safe status label
- a private note ID or opaque reference when useful
- whether human review is required

## Public Brain Must Not Copy

- private reflections
- detailed family information
- health details
- detailed financial state
- raw private transcripts
- confidential decisions
- credentials or secrets

## Retrieval Flow

```text
User request
-> determine whether private context is materially relevant
-> retrieve only the needed private source when authorized
-> reason with it in the current interaction
-> return the answer
-> persist only the minimum public-safe bridge, if any
```

## Write Flow

```text
Potential durable information
-> memory_route skill
-> privacy classification
-> public-safe => public brain
-> private/sensitive => private source
-> report route and provenance
```

## Sovereignty Rule

Private memory increases continuity but does not increase LUMAN's moral authority. A private historical record remains contestable, correctable, archivable, and subordinate to current human authority.
