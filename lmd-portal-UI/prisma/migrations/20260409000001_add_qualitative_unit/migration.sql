-- Migration: add_qualitative_unit
-- Adds 'qualitative' to the MeasurementUnit enum for KRs that track
-- progress through narrative only (no numeric value required).

ALTER TYPE "MeasurementUnit" ADD VALUE 'qualitative';
