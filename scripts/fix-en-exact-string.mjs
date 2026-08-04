import fs from 'fs';
import path from 'path';

const enDir = 'd:/Projects/appaw-store/src/lib/guides/content/en';
const exactString = 'We provide free preliminary card inspection to evaluate condition and predict potential grades. Coupled with basic cleaning & maintenance, we reduce point-deduction risks during grading and strive for the highest possible grade for your collection.';

const files = fs.readdirSync(enDir).filter(f => f.endsWith('.ts'));

for (const file of files) {
  const filePath = path.join(enDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  // hong-kong-tcg-grading-guide.ts
  content = content.replace(/On arrival, Appaw provides free preliminary card inspection to evaluate condition and predict potential grades, plus basic cleaning & maintenance to reduce point-deduction risks during grading\./g, `On arrival, ${exactString.charAt(0).toLowerCase() + exactString.slice(1)}`);
  content = content.replace(/On arrival, Appaw evaluates condition, predicts potential grades, and applies basic cleaning & maintenance to reduce point-deduction risks and strive for the highest possible grade for your collection\./g, `On arrival, ${exactString.charAt(0).toLowerCase() + exactString.slice(1)}`);
  content = content.replace(/At the shop, Appaw runs free preliminary card inspection before confirming your PSA tier and intake;/g, `At the shop, ${exactString.charAt(0).toLowerCase() + exactString.slice(1)} We then confirm your PSA tier and intake;`);
  content = content.replace(/On arrival, Appaw starts with free preliminary card inspection, checking centering, surface, and corners and predicting potential grades\. If the card is submission-ready, basic cleaning & maintenance follows to reduce point-deduction risks\./g, `On arrival, ${exactString.charAt(0).toLowerCase() + exactString.slice(1)}`);
  content = content.replace(/At the shop, Appaw provides free preliminary card inspection, grade prediction, and basic cleaning & maintenance to reduce point-deduction risks\./g, `At the shop, ${exactString.charAt(0).toLowerCase() + exactString.slice(1)}`);
  content = content.replace(/Appaw Store runs PSA proxy submission: free preliminary card inspection, basic cleaning & maintenance, list verification, reference codes, forwarding to PSA, online tracking, and pickup notices\./g, `Appaw Store runs PSA proxy submission: list verification, reference codes, forwarding to PSA, online tracking, and pickup notices. ${exactString}`);
  content = content.replace(/Appaw provides free preliminary card inspection, grade prediction, and basic cleaning & maintenance to reduce point-deduction risks during grading\./g, exactString);

  // grade-or-protect-first.ts
  content = content.replace(/Hong Kong collectors can drop off at partner store \[138 Arena\]\(\/business\/psa-grading\/\) \(Causeway Bay\) for free preliminary card inspection, grade prediction, and basic cleaning & maintenance before confirming a PSA tier\./g, `Hong Kong collectors can drop off at partner store [138 Arena](/business/psa-grading/) (Causeway Bay). ${exactString} Then we confirm your PSA tier.`);
  content = content.replace(/Appaw provides free preliminary card inspection, grade prediction, and basic cleaning & maintenance to reduce point-deduction risks before confirming your service tier\./g, `${exactString} Then we confirm your service tier.`);
  content = content.replace(/Hong Kong collectors can also get free preliminary card inspection and basic cleaning & maintenance at 138 Arena\./g, `Hong Kong collectors can drop off at 138 Arena. ${exactString}`);
  content = content.replace(/Hong Kong collectors can drop off at 138 Arena for free preliminary card inspection, grade prediction, and basic cleaning & maintenance\./g, `Hong Kong collectors can drop off at 138 Arena. ${exactString}`);

  // psa-grading-standards.ts
  content = content.replace(/Basic cleaning & maintenance before submission can reduce point-deduction risks on borderline copies, though it cannot remove factory print defects \(PD\) or off-center issues \(OC\)\. Screen condition and centering before you pay grading fees\./g, `${exactString} Note that this cannot remove factory print defects (PD) or off-center issues (OC).`);
  content = content.replace(/Drop off at 138 Arena, Causeway Bay for free preliminary card inspection, grade prediction, and basic cleaning & maintenance before proxy submission\./g, `Drop off at 138 Arena, Causeway Bay. ${exactString}`);
  content = content.replace(/Hong Kong collectors can also get free preliminary card inspection and basic cleaning & maintenance at 138 Arena before proxy submission\./g, `Hong Kong collectors can drop off at 138 Arena. ${exactString}`);

  // regrade-or-reholder.ts
  content = content.replace(/Hong Kong collectors can visit \[138 Arena\]\(\/business\/psa-grading\/\) for free preliminary card inspection and basic cleaning & maintenance before mailing for reholder or regrade\./g, `Hong Kong collectors can visit [138 Arena](/business/psa-grading/). ${exactString}`);
  content = content.replace(/Hong Kong collectors can drop off at \[138 Arena\]\(\/business\/psa-grading\/\) for free preliminary card inspection, grade prediction, and basic cleaning & maintenance before reholder or regrade submission\./g, `Hong Kong collectors can drop off at [138 Arena](/business/psa-grading/). ${exactString}`);
  content = content.replace(/Hong Kong collectors can get free preliminary card inspection and basic cleaning & maintenance at 138 Arena first\./g, `Hong Kong collectors can drop off at 138 Arena. ${exactString}`);

  // psa-10-centering-requirements.ts
  content = content.replace(/Hong Kong collectors drop off at \[138 Arena PSA submission\]\(\/business\/psa-grading\/\) for free preliminary card inspection, grade prediction, and basic cleaning & maintenance to reduce point-deduction risks, with batch tracking online\./g, `Hong Kong collectors drop off at [138 Arena PSA submission](/business/psa-grading/). ${exactString} Batch tracking is available online.`);
  content = content.replace(/Hong Kong collectors can also get free preliminary card inspection and basic cleaning & maintenance at 138 Arena\./g, `Hong Kong collectors can drop off at 138 Arena. ${exactString}`);
  content = content.replace(/Drop off at 138 Arena for free preliminary card inspection, grade prediction, and basic cleaning & maintenance before PSA proxy submission\./g, `Drop off at 138 Arena. ${exactString}`);

  // choose-35pt-slab-protector.ts
  content = content.replace(/Raw cards heading to PSA\? Hong Kong collectors can drop off at \[138 Arena\]\(\/business\/psa-grading\/\) for free preliminary card inspection, grade prediction, and basic cleaning & maintenance first\./g, `Raw cards heading to PSA? Hong Kong collectors can drop off at [138 Arena](/business/psa-grading/). ${exactString}`);

  // display-graded-cards.ts
  content = content.replace(/Still holding raw copies\? Hong Kong collectors can get free preliminary card inspection and basic cleaning & maintenance at \[138 Arena\]\(\/business\/psa-grading\/\) before PSA submission\./g, `Still holding raw copies? Hong Kong collectors can drop off at [138 Arena](/business/psa-grading/). ${exactString}`);
  content = content.replace(/Raw cards still to grade\? Drop off at 138 Arena for free preliminary card inspection, grade prediction, and basic cleaning & maintenance before PSA proxy submission\./g, `Raw cards still to grade? Drop off at 138 Arena. ${exactString}`);

  // identify-fake-psa-slabs.ts
  content = content.replace(/Hong Kong collectors can drop off at \[138 Arena\]\(\/business\/psa-grading\/\) for free preliminary card inspection, condition evaluation, and grade prediction before proxy submission\./g, `Hong Kong collectors can drop off at [138 Arena](/business/psa-grading/). ${exactString}`);
  content = content.replace(/Buying raw instead\? Hong Kong collectors can get free preliminary card inspection, grade prediction, and basic cleaning & maintenance at 138 Arena before PSA proxy submission\./g, `Buying raw instead? Hong Kong collectors can drop off at 138 Arena. ${exactString}`);

  // uv-protection-graded-cards.ts
  content = content.replace(/Still grading raw copies\? Hong Kong collectors can get free preliminary card inspection and basic cleaning & maintenance at \[138 Arena\]\(\/business\/psa-grading\/\) before PSA submission\./g, `Still grading raw copies? Hong Kong collectors can drop off at [138 Arena](/business/psa-grading/). ${exactString}`);
  content = content.replace(/Raw cards still in hand\? Drop off at 138 Arena for free preliminary card inspection, grade prediction, and basic cleaning & maintenance to reduce point-deduction risks and strive for the highest grade\./g, `Raw cards still in hand? Drop off at 138 Arena. ${exactString}`);

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${file}`);
  }
}
