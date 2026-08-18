# Skill: Memory Route

## Purpose

Classify potentially durable information and route it to the correct public, private, sensitive, temporary, or archived destination.

## Trigger

Use when a conversation, decision, document, result, or project update may be useful beyond the current interaction.

## Sovereignty Class

Class A for classification and approved persistence.  
Class B when persistence intent or ownership is ambiguous.

## Required Inputs

- Information to classify
- Current project/domain context
- Known privacy boundary

## Procedure

1. Identify the domain and source owner.
2. Determine whether the information is durable or temporary.
3. Classify privacy:
   - public-safe
   - private
   - sensitive
   - transient
   - archive
4. Determine authority/provenance:
   - user stated
   - sourced
   - generated
   - inferred
   - remembered
5. Check for an existing source-of-truth file before creating a new one.
6. Route to the smallest appropriate destination.
7. Preserve uncertainty rather than converting inference into fact.
8. Report what was stored, where, and why.

## Memory Rule

```text
If it is stored, preserve provenance.
If it is not stored, do not pretend it was stored.
```

## Public / Private Boundary

Public GitHub may contain reusable structures, public-safe project state, doctrine, templates, and non-sensitive canon.

Private sources hold personal reflections, private financial state, health details, family details, sensitive decisions, raw voice transcripts, and other information not appropriate for the public repository.

## Output

```text
Classification:
Owner:
Privacy:
Destination:
Provenance:
Persistence action:
Open warning:
```
