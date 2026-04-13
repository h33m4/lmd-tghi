// import { PrismaClient, MeasurementUnit } from "@prisma/client";

// const prisma = new PrismaClient();

// /**
//  * Denominator configuration for each percentage-based OKR
//  * Update the 'denominator' values with actual counts from your data
//  */
// const PERCENTAGE_OKR_CONFIG: Record<
//   string,
//   {
//     denominator: number;
//     denominatorLabel: string;
//     numeratorLabel: string;
//     notes?: string;
//   }
// > = {
//   "1.1": {
//     denominator: 50, // UPDATE: Total gaps identified from capacity development plan
//     denominatorLabel:
//       "Total gaps identified from the annual capacity development plan",
//     numeratorLabel: "Number of gaps addressed",
//     notes:
//       "Update denominator based on actual gaps identified in the capacity development plan for CHSD, HFU, HMER, and HRH directorates",
//   },
//   "1.2": {
//     denominator: 5000, // UPDATE: Total CHWs in the system
//     denominatorLabel: "Total CHWs in the system",
//     numeratorLabel: "Number of CHWs with data incorporated into master list",
//     notes: "Update denominator based on actual total CHW count",
//   },
//   "1.3": {
//     denominator: 100, // This is improvement percentage, not a ratio - may need different handling
//     denominatorLabel: "Baseline maturity model assessment score",
//     numeratorLabel: "Improvement in maturity model score",
//     notes:
//       "This measures improvement, not a ratio. May need special calculation logic.",
//   },
//   "2.1": {
//     denominator: 500, // UPDATE: Total CHAs trained (varies as training continues)
//     denominatorLabel: "Total CHAs trained in LMH supported counties",
//     numeratorLabel: "Number of CHAs who passed the post-training assessment",
//     notes:
//       "VARIABLE DENOMINATOR: Updates as more CHAs are trained. Consider using denominatorOverride in monthly updates.",
//   },
//   "2.2": {
//     denominator: 800, // UPDATE: Total CHAs in LMH supported counties
//     denominatorLabel: "Total CHAs in LMH supported counties",
//     numeratorLabel: "Number of CHAs receiving correct and on-time payments",
//     notes: "Update denominator based on actual CHA count in supported counties",
//   },
//   "2.3": {
//     denominator: 350, // UPDATE: Total communities in service area
//     denominatorLabel: "Total communities in LMH service area",
//     numeratorLabel: "Number of communities with an active CHC",
//     notes: "Update denominator based on actual community count",
//   },
//   "2.4": {
//     denominator: 800, // UPDATE: Total CHAs in LMH supported counties
//     denominatorLabel: "Total CHAs in LMH supported counties",
//     numeratorLabel:
//       "Number of CHAs with all community health tracer drugs in stock",
//     notes: "Same denominator as 2.2",
//   },
//   "2.5": {
//     denominator: 200, // UPDATE: Total newly recruited CHWs (varies)
//     denominatorLabel: "Total newly recruited Community Health Workers",
//     numeratorLabel: "Number of female CHWs recruited",
//     notes:
//       "VARIABLE DENOMINATOR: Updates as recruitment continues. Use denominatorOverride in monthly updates.",
//   },
//   "2.6": {
//     denominator: 800, // UPDATE: Total CHAs in LMH supported counties
//     denominatorLabel: "Total CHAs in Last Mile Health supported counties",
//     numeratorLabel: "Number of CHAs receiving 2+ supervision visits monthly",
//     notes: "Same denominator as 2.2 and 2.4",
//   },
//   "3.1": {
//     denominator: 150, // UPDATE: Total healthcare facilities in all counties
//     denominatorLabel: "Total healthcare facilities in all counties",
//     numeratorLabel:
//       "Number of facilities reporting monthly malaria immunization outreach data",
//     notes:
//       "Update denominator based on actual facility count across all counties",
//   },
//   "3.4": {
//     denominator: 25, // UPDATE: Total female CHSS trained in Rivercess
//     denominatorLabel: "Total female CHSS trained in Rivercess",
//     numeratorLabel:
//       "Number of female CHSS who received motorbike safety training",
//     notes: "Update denominator based on actual female CHSS count in Rivercess",
//   },
//   "4.1": {
//     denominator: 1200, // UPDATE: Total CHSS MSRs expected (e.g., 100 CHSS × 12 months)
//     denominatorLabel: "Total CHSS Monthly Service Reports expected",
//     numeratorLabel: "Number of MSRs accurately completed and submitted on time",
//     notes:
//       "Calculate based on: Number of CHSS × 12 months (or reporting periods)",
//   },
//   "4.3": {
//     denominator: 1200, // UPDATE: Total CHSS eLMIS submissions expected
//     denominatorLabel: "Total CHSS eLMIS submissions expected",
//     numeratorLabel:
//       "Number of eLMIS submissions accurately completed and submitted on time",
//     notes:
//       "Calculate based on: Number of CHSS × 12 months (or reporting periods)",
//   },
//   "4.5": {
//     denominator: 20, // UPDATE: Total projects
//     denominatorLabel: "Total active projects",
//     numeratorLabel: "Number of projects that completed a learning activity",
//     notes: "Update denominator based on actual project count",
//   },
//   "5.2": {
//     denominator: 100, // UPDATE: Baseline employee relations issues count
//     denominatorLabel: "Baseline number of employee relations issues",
//     numeratorLabel: "Reduction in employee relations issues",
//     notes: "This measures reduction. Numerator = baseline - current issues.",
//   },
//   "5.3": {
//     denominator: 150, // UPDATE: Total DEI training participants
//     denominatorLabel: "Total DEI training participants",
//     numeratorLabel:
//       "Number of participants reporting increased application of DEI principles",
//     notes: "Update denominator based on actual training participant count",
//   },
//   "6.1": {
//     denominator: 500, // UPDATE: Total procurements raised from Tradogram monthly
//     denominatorLabel: "Total procurements raised from Tradogram",
//     numeratorLabel:
//       "Number of procurements closed in line with terms and conditions",
//     notes: "This is a monthly metric, denominator may vary each month",
//   },
//   "6.3": {
//     denominator: 200, // UPDATE: Total staff members
//     denominatorLabel: "Total staff members",
//     numeratorLabel:
//       "Number of staff trained on safety, security, procurement, IT, fleet, and finance policies",
//     notes: "Update denominator based on actual staff count",
//   },
//   "6.5": {
//     denominator: 1000, // UPDATE: Total financial transactions monthly
//     denominatorLabel: "Total financial transactions",
//     numeratorLabel:
//       "Number of transactions processed through mobile money and digital banking",
//     notes: "This is likely a monthly metric, denominator may vary",
//   },
//   "7.1": {
//     denominator: 50, // UPDATE: Total donor reports expected
//     denominatorLabel: "Total donor reports expected",
//     numeratorLabel: "Number of donor reports submitted on time",
//     notes: "Update denominator based on actual donor reporting requirements",
//   },
// };

// async function populateOkrDenominators() {
//   console.log("Starting OKR denominator population...\n");

//   let updatedCount = 0;
//   let skippedCount = 0;
//   const warnings: string[] = [];

//   for (const [okrId, config] of Object.entries(PERCENTAGE_OKR_CONFIG)) {
//     try {
//       // Find the OKR
//       const okr = await prisma.okr.findUnique({
//         where: { okrId },
//       });

//       if (!okr) {
//         console.warn(`OKR ${okrId} not found in database, skipping...`);
//         skippedCount++;
//         continue;
//       }

//       // Verify it's a percentage OKR
//       if (okr.unit !== MeasurementUnit.percent) {
//         console.log(
//           `OKR ${okrId} is not percentage-based (unit: ${okr.unit}), skipping...`,
//         );
//         skippedCount++;
//         continue;
//       }

//       // Update the OKR with denominator data
//       await prisma.okr.update({
//         where: { okrId },
//         data: {
//           denominator: config.denominator,
//           denominatorLabel: config.denominatorLabel,
//           numeratorLabel: config.numeratorLabel,
//         },
//       });

//       console.log(`✅ OKR ${okrId}: ${okr.keyResult.substring(0, 80)}...`);
//       console.log(
//         `   Denominator: ${config.denominator} (${config.denominatorLabel})`,
//       );
//       console.log(`   Numerator: ${config.numeratorLabel}`);

//       if (config.notes) {
//         console.log(`   📝 Note: ${config.notes}`);
//         warnings.push(`${okrId}: ${config.notes}`);
//       }

//       console.log("");
//       updatedCount++;
//     } catch (error) {
//       console.error(`❌ Error updating OKR ${okrId}:`, error);
//     }
//   }

//   // Summary
//   console.log("\n" + "=".repeat(80));
//   console.log("📊 MIGRATION SUMMARY");
//   console.log("=".repeat(80));
//   console.log(`✅ Successfully updated: ${updatedCount} OKRs`);
//   console.log(`⏭️  Skipped: ${skippedCount} OKRs`);

//   if (warnings.length > 0) {
//     console.log("\n⚠️  IMPORTANT NOTES - ACTION REQUIRED:");
//     console.log("=".repeat(80));
//     warnings.forEach((warning, index) => {
//       console.log(`${index + 1}. ${warning}\n`);
//     });
//   }

//   console.log("\n🎯 NEXT STEPS:");
//   console.log(
//     "1. Review the denominators above and update placeholder values with actual counts",
//   );
//   console.log(
//     '2. Pay special attention to OKRs marked with "VARIABLE DENOMINATOR"',
//   );
//   console.log(
//     "3. Run this script again after updating the denominators in the code",
//   );
//   console.log(
//     "4. Test the monthly update form to ensure calculations work correctly\n",
//   );
// }

// // Execute the migration
// populateOkrDenominators()
//   .then(() => {
//     console.log("✨ Migration completed successfully!");
//   })
//   .catch((error) => {
//     console.error("💥 Migration failed:", error);
//     process.exit(1);
//   })
//   .finally(async () => {
//     await prisma.$disconnect();
//   });
