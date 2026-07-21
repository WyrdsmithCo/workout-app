/* ============================================================
   program.js — ALL workout data lives here, and only here.
   No DOM, no state. Pure data + small builder helpers.
   Because it's separate, the Today page, Exercise Library, and
   Progress page can all read the same source of truth.
   ============================================================ */

export const PHASELEN = { 1: 12, 2: 16, 3: 8 };
export const PHASENAME = { 1: 'Lean Out', 2: 'Build', 3: 'Refine' };
export const PHASEDESC = {
  1: 'Fat-loss emphasis · full-body 3–4x',
  2: 'Muscle build · Upper/Lower split',
  3: 'Reveal the muscle · heavy lifts + more cardio',
};
export const FULL = { Mon: 'Monday', Wed: 'Wednesday', Fri: 'Friday', Sat: 'Saturday' };

/* ---- strength exercise library ---- */
export const L = {
  rowSA:{name:'Single-arm dumbbell row',cue:'Flat back, brace on a couch, pull elbow to hip, squeeze the shoulder blade.',mod:'Lighter weight — chase the squeeze, not the number.',why:'THE back-width and thickness builder, and it hammers the biceps. Your #1 move for a strong-looking back.',muscles:'Lats, mid-back, biceps',weight:true,tempo:'2-1-2',alts:[{name:'Bent-over two-arm row'},{name:'Kettlebell row'}]},
  rowBent:{name:'Bent-over two-arm row',cue:'Hinge forward flat-backed, row both dumbbells to your ribs.',mod:'Less hinge, lighter weight.',why:'Adds mid-back thickness and a second rowing angle.',muscles:'Mid-back, lats, biceps',weight:true,tempo:'2-1-1',alts:[{name:'Single-arm row'},{name:'Chest-supported row'}]},
  pullover:{name:'Dumbbell pullover',cue:'Slight elbow bend, lower behind your head, feel the lats stretch, pull back over the chest.',mod:'Lighter; keep the range comfortable.',why:'Best dumbbell lat builder — gives the back that wide, tapered look.',muscles:'Lats, chest',weight:true,tempo:'3-1-1',alts:[{name:'Straight-arm pulldown (band)'},{name:'Bench pullover'}]},
  revfly:{name:'Chest-supported reverse fly',cue:'Thumbs up, squeeze the shoulder blades together, no swinging.',mod:'Bend over standing if no incline; light weight.',why:'Rear delts + upper back — posture, and it makes the waist look smaller.',muscles:'Rear delts, rhomboids',weight:true,alts:[{name:'Bent-over reverse fly'}]},
  curl:{name:'Bicep curl',cue:'Elbows pinned, no swinging, control the weight down slowly.',mod:'Lighter; one arm at a time.',why:'Direct front-of-arm toning.',muscles:'Biceps',weight:true,tempo:'2-1-2',alts:[{name:'Hammer curl'}]},
  hammer:{name:'Hammer curl',cue:'Neutral grip (palms in), control the lowering.',mod:'One arm at a time.',why:'Thickness in the arm and forearm — the toned-strong-arm look.',muscles:'Biceps, brachialis, forearms',weight:true,alts:[{name:'Cross-body curl'}]},
  superman:{name:'Superman / back extension',cue:'Lift chest and legs, squeeze low back + glutes, neck neutral.',mod:'Lift just the upper body.',why:'Strengthens the lower back and erectors — protects your spine, completes posture.',muscles:'Lower back, erectors, glutes',weight:false,alts:[{name:'Bird-dog'}]},
  goblet:{name:'Kettlebell goblet squat',cue:'Chest tall, knees track over toes, sit between your hips.',mod:'Squat to a chair (box squat).',why:'Foundational lower-body builder — quads and glutes together.',muscles:'Quads, glutes, core',weight:true,tempo:'2-1-1',alts:[{name:'Dumbbell goblet squat'},{name:'Bodyweight squat',weight:false}]},
  rdl:{name:'Dumbbell / KB Romanian deadlift',cue:'Push hips back, soft knees, flat back, lower to mid-shin.',mod:'Shorten the range — only as low as you keep a flat back.',why:'The best move for glute + hamstring shape. Hip-hinge builds the peach.',muscles:'Glutes, hamstrings, lower back',weight:true,tempo:'3-1-1',alts:[{name:'Single-leg RDL'},{name:'Dumbbell RDL'}]},
  hipthrust:{name:'Hip thrust',cue:'Shoulders on a bench/couch, chin tucked, drive through heels, squeeze at the top.',mod:'Do floor glute bridges instead.',why:'The most direct glute builder there is.',muscles:'Glutes',weight:true,tempo:'2-1-1',alts:[{name:'Floor glute bridge',weight:false},{name:'Single-leg glute bridge',weight:false}]},
  lunge:{name:'Reverse lunge',cue:'Step back, drop straight down, drive up through the front heel.',mod:'Hold a wall for balance; lighter weight.',why:'Single-leg glute work that fixes side-to-side imbalances.',muscles:'Glutes, quads',weight:true,tempo:'2-0-1',alts:[{name:'Split squat'},{name:'Step-up'}]},
  splitsquat:{name:'Rear-foot-elevated split squat',cue:'Back foot on a couch, drop straight down, weight through the front heel.',mod:'Both feet on floor (regular split squat).',why:'Brutal glute and quad builder per leg — big driver of lower-body shape.',muscles:'Glutes, quads',weight:true,tempo:'2-1-1',alts:[{name:'Split squat'},{name:'Reverse lunge'}]},
  slbridge:{name:'Single-leg glute bridge',cue:'One foot planted, drive the hip up, squeeze that glute.',mod:'Two-leg glute bridge.',why:'Isolates each glute and evens out imbalances.',muscles:'Glutes',weight:false,alts:[{name:'Two-leg glute bridge'}]},
  calf:{name:'Standing calf raise',cue:'Full stretch at the bottom, full squeeze at the top.',mod:'Bodyweight only.',why:'Rounds out the lower leg.',muscles:'Calves',weight:true,alts:[{name:'Bodyweight calf raise',weight:false}]},
  deadbug:{name:'Dead bug',cue:'Press your low back flat into the mat the whole time. Move slow.',mod:'One limb at a time.',why:'Deep-core work that pulls the waist in — unlike crunches.',muscles:'Transverse abdominis, core',weight:false,alts:[{name:'Bird-dog'}]},
  floorpress:{name:'Dumbbell floor press',cue:'Elbows ~45° from the body, press up and slightly together.',mod:'Lower the weight; pause when triceps touch the floor.',why:'Chest + triceps, shoulder-friendly for getting back into pressing.',muscles:'Chest, triceps, front delts',weight:true,tempo:'2-0-1',alts:[{name:'Dumbbell bench press'},{name:'Push-up',weight:false}]},
  ohp:{name:'Overhead press',cue:'Brace the core, don\u2019t arch, press straight overhead.',mod:'Do it seated for support.',why:'Shoulder strength and cap — defined shoulders make the waist look smaller.',muscles:'Shoulders, triceps',weight:true,tempo:'2-0-1',alts:[{name:'Seated overhead press'},{name:'Arnold press'},{name:'Kettlebell press'}]},
  pushup:{name:'Incline push-up',cue:'Hands raised, body in a straight line, lower with control.',mod:'Higher surface = easier. Wall push-ups to start.',why:'Scalable bodyweight chest + core.',muscles:'Chest, triceps, core',weight:false,alts:[{name:'Knee push-up'},{name:'Floor push-up'}]},
  lateral:{name:'Lateral raise',cue:'Lead with the elbows, raise to shoulder height, don\u2019t shrug.',mod:'Very light — form over weight.',why:'Widens the shoulders, visually narrowing the waist.',muscles:'Side delts',weight:true,alts:[{name:'Front raise'}]},
  triext:{name:'Overhead triceps extension',cue:'Elbows point forward and stay put — only the forearms move.',mod:'One dumbbell, both hands.',why:'Tones the back of the arms directly.',muscles:'Triceps',weight:true,tempo:'2-1-1',alts:[{name:'Triceps kickback'},{name:'Bench dip',weight:false}]},
  kickback:{name:'Triceps kickback',cue:'Upper arm parallel to the floor, straighten the elbow, squeeze.',mod:'Lighter, one arm at a time.',why:'Isolates the triceps for arm definition.',muscles:'Triceps',weight:true,alts:[{name:'Overhead triceps extension'}]},
  legraise:{name:'Lying leg raise',cue:'Low back pressed down, lower the legs slow, don\u2019t arch.',mod:'Bend the knees.',why:'Lower-ab and deep-core work.',muscles:'Abs, hip flexors',weight:false,alts:[{name:'Dead bug'},{name:'Reverse crunch'}]},
  plank:{name:'Plank',cue:'Straight line head to heels, squeeze glutes, don\u2019t sag.',mod:'Drop to knees.',why:'Total-core stability and the deep muscles that flatten the midsection.',muscles:'Core, abs',weight:false,time:40,alts:[{name:'Knee plank'}]},
  bicycle:{name:'Bicycle crunch',cue:'Slow and controlled, opposite elbow to knee, don\u2019t yank the neck.',mod:'Slow single reps.',why:'Obliques and rectus abdominis.',muscles:'Abs, obliques',weight:false,alts:[{name:'Seated twist'}]},
  sideplank:{name:'Side plank',cue:'Hips high, body in a straight line.',mod:'Drop the bottom knee.',why:'Obliques and deep core that cinch the waist.',muscles:'Obliques, core',weight:false,time:20,alts:[{name:'Knee side plank'}]},
};

/* ---- cardio library ---- */
export const CARD = {
  swing:{name:'Kettlebell swing intervals',dur:'30s work / 30s rest × 8',intensity:'Moderate–hard (RPE 7/10)',recs:'Hinge and snap the hips — do NOT squat it. The bell floats up from hip drive.',time:30,cardio:true,yt:'kettlebell swing beginner'},
  swingBig:{name:'Kettlebell swing intervals',dur:'30s work / 30s rest × 10',intensity:'Hard (RPE 8/10)',recs:'Powerful hip snap, keep the arms relaxed. Rest fully if form slips.',time:30,cardio:true,yt:'kettlebell swing beginner'},
  bag:{name:'Heavy bag rounds',dur:'3 × 3-min rounds, 60s rest',intensity:'Build to hard',recs:'Feet always moving. Simple combos: jab-cross, add hooks.',time:180,cardio:true,yt:'heavy bag workout beginner'},
  bagBig:{name:'Heavy bag rounds',dur:'4 × 3-min rounds, 60s rest',intensity:'Hard',recs:'Push the pace — this is a fat-loss day. Keep punching through the round.',time:180,cardio:true,yt:'heavy bag workout beginner'},
  bagFin:{name:'Bag finisher',dur:'2 × 90 sec',intensity:'Moderate',recs:'Only if you\u2019ve got gas left — shake out the arms.',time:90,cardio:true,yt:'heavy bag combos beginner'},
  walk:{name:'Brisk walk',dur:'10–15 min',intensity:'Easy–moderate',recs:'Bonus fat-loss and a nice way to end strong.',cardio:true},
};

/* ---- simple (warm-up / activation / cool-down) items ---- */
const S = (name, detail, time) => ({ simple: true, name, detail, time });

const WARM_LOWER=[S('March / light bag bounce','2 min',120),S('Leg swings','10 each leg'),S('Hip circles','10 each way'),S('Bodyweight squats','10 slow'),S("World's greatest stretch",'5 each side')];
const WARM_UPPER=[S('Arm circles','15 each way'),S('Towel shoulder dislocates','10 reps'),S('Scapular push-ups','10 reps'),S('Cat-cow','8 reps'),S('Wall slides','10 reps')];
const WARM_PULL=[S('Arm circles','15 each way'),S('Cat-cow','8 reps'),S('Scapular retractions','12 reps'),S('Thoracic rotations','8 each side'),S('Doorway lean / dead hang','20 sec',20)];
const WARM_COND=[S('Jog in place / bag bounce','2 min',120),S('Arm circles','15 each way'),S('Hip openers','10 each side'),S('Inchworm','6 reps')];
const ACT_GLUTE=[S('Glute bridge','15 reps'),S('Standing hip abduction','12 each side'),S('Bodyweight good morning','12 reps')];
const ACT_UPPER=[S('Incline / knee push-ups','8 reps'),S('Light reverse fly','12 reps')];
const ACT_PULL=[S('Light reverse fly','15 reps'),S('Superman hold','3 × 10 sec',10)];
const ACT_COND=[S('Step jacks / jumping jacks','2 × 30 sec',30),S('Bodyweight squats','10 reps')];
const COOL_LOWER=[S('Standing quad stretch','30 sec each',30),S('Figure-4 glute stretch','30 sec each',30),S('Hamstring stretch','30 sec each',30),S("Child's pose",'45 sec',45)];
const COOL_UPPER=[S('Doorway chest stretch','30 sec each',30),S('Cross-body shoulder stretch','30 sec each',30),S('Overhead triceps stretch','30 sec each',30),S('Neck rolls','30 sec',30)];
const COOL_PULL=[S("Child's pose w/ side reach",'30 sec each',30),S('Doorway lat stretch','30 sec each',30),S('Cross-body shoulder stretch','30 sec each',30),S('Biceps wall stretch','30 sec each',30)];
const COOL_COND=[S('Cat-cow','8 reps'),S('Cobra stretch','30 sec',30),S('Standing side bend','30 sec each',30),S('Deep breathing','1 min',60)];

/* ---- builders ---- */
const sec = (type, title, min, items) => ({ type, title, min, items });
const str = (k, sets, reps, rest, opt) => { const o = Object.assign({}, L[k], { sets, reps, rest }); if (opt) o.opt = true; return o; };
const card = (k, opt) => { const o = Object.assign({}, CARD[k]); if (opt) o.opt = true; return o; };

/* ---- the 3-phase program ---- */
export const PROGRAMS = {
  1: { order:['Mon','Wed','Fri','Sat'], days:{
    Mon:{title:'Lower Body + Glutes',focus:'Legs · Glutes',min:45,note:null,sections:[
      sec('warm','Warm-up',7,WARM_LOWER),sec('act','Glute activation',4,ACT_GLUTE),
      sec('str','Strength',26,[str('goblet',3,'10',90),str('rdl',3,'10',90),str('hipthrust',3,'12',75),str('lunge',3,'8 each',60),str('calf',3,'15',45),str('deadbug',3,'10',45)]),
      sec('cool','Cool-down',5,COOL_LOWER)]},
    Wed:{title:'Conditioning + Core',focus:'Cardio · Fat-loss',min:45,note:'Your big fat-loss day. Push the intensity here — it does more for the scale than any single lifting day.',sections:[
      sec('warm','Warm-up',6,WARM_COND),sec('act','Activation',3,ACT_COND),
      sec('cardio','Cardio (main event)',24,[card('swing'),card('bag'),card('walk',true)]),
      sec('str','Core',8,[str('plank',3,'30–45s',30),str('bicycle',3,'20',30),str('sideplank',3,'20s each',30)]),
      sec('cool','Cool-down',5,COOL_COND)]},
    Fri:{title:'Push — Chest, Shoulders, Arms',focus:'Chest · Shoulders · Triceps',min:44,note:null,sections:[
      sec('warm','Warm-up',6,WARM_UPPER),sec('act','Activation',3,ACT_UPPER),
      sec('str','Strength',25,[str('floorpress',3,'10',90),str('ohp',3,'10',90),str('pushup',3,'8–12',60),str('lateral',3,'12',45),str('triext',3,'12',45)]),
      sec('cardio','Optional finisher',3,[card('bagFin',true)]),sec('cool','Cool-down',5,COOL_UPPER)]},
    Sat:{title:'Pull — Back & Arms',focus:'Back · Biceps · YOUR priority',min:46,note:'Your signature day — the strong back and toned arms you\u2019re after. Slow the pulling reps down and squeeze the shoulder blades.',sections:[
      sec('warm','Warm-up',6,WARM_PULL),sec('act','Activation',3,ACT_PULL),
      sec('str','Strength',27,[str('rowSA',3,'10 each',75),str('pullover',3,'10',75),str('revfly',3,'15',60),str('curl',3,'10',60),str('hammer',3,'12',45),str('superman',3,'12',45)]),
      sec('cardio','Optional finisher',3,[card('walk',true)]),sec('cool','Cool-down',5,COOL_PULL)]},
  }},
  2: { order:['Mon','Wed','Fri','Sat'], days:{
    Mon:{title:'Upper A — Pull (Back & Arms)',focus:'Back · Biceps · priority',min:48,note:'Build phase: heavier weight, 6–10 reps, more volume on your priority muscles. Add weight before adding reps.',sections:[
      sec('warm','Warm-up',6,WARM_PULL),sec('act','Activation',3,ACT_PULL),
      sec('str','Strength',30,[str('rowSA',4,'8–10',90),str('pullover',3,'10',75),str('rowBent',3,'10',75),str('revfly',3,'15',60),str('curl',4,'10',60),str('hammer',3,'12',45)]),
      sec('cardio','Conditioning finisher',5,[card('swing',true)]),sec('cool','Cool-down',5,COOL_PULL)]},
    Wed:{title:'Lower A — Squat focus',focus:'Quads · Glutes',min:47,note:null,sections:[
      sec('warm','Warm-up',7,WARM_LOWER),sec('act','Glute activation',4,ACT_GLUTE),
      sec('str','Strength',30,[str('goblet',4,'8',100),str('rdl',4,'8',100),str('hipthrust',4,'10',75),str('lunge',3,'10 each',60),str('calf',3,'15',45),str('legraise',3,'12',45)]),
      sec('cardio','Conditioning finisher',4,[card('bagFin',true)]),sec('cool','Cool-down',5,COOL_LOWER)]},
    Fri:{title:'Upper B — Push (Shoulders & Arms)',focus:'Chest · Shoulders · Triceps',min:47,note:null,sections:[
      sec('warm','Warm-up',6,WARM_UPPER),sec('act','Activation',3,ACT_UPPER),
      sec('str','Strength',30,[str('floorpress',4,'8–10',90),str('ohp',4,'8',90),str('pushup',3,'AMRAP',60),str('lateral',4,'12',45),str('triext',3,'12',45),str('kickback',3,'12 each',45),str('revfly',3,'15',45)]),
      sec('cool','Cool-down',5,COOL_UPPER)]},
    Sat:{title:'Lower B — Hinge & Glutes + Cardio',focus:'Glutes · Hamstrings',min:50,note:'Second lower day leans into the glutes. Then a real cardio hit to keep fat loss ticking while you build.',sections:[
      sec('warm','Warm-up',7,WARM_LOWER),sec('act','Glute activation',4,ACT_GLUTE),
      sec('str','Strength',28,[str('rdl',4,'8',100),str('splitsquat',3,'8 each',75),str('hipthrust',4,'12',75),str('slbridge',3,'10 each',45),str('calf',4,'15',45)]),
      sec('cardio','Cardio',16,[card('swing'),card('bag'),card('walk',true)]),sec('cool','Cool-down',5,COOL_LOWER)]},
  }},
  3: { order:['Mon','Wed','Fri','Sat'], days:{
    Mon:{title:'Full Upper — Keep the Muscle',focus:'Back · Chest · Arms',min:44,note:'Refine phase: small deficit. Keep the weights HEAVY — that\u2019s what tells your body to hold the muscle you built. Cardio goes up.',sections:[
      sec('warm','Warm-up',6,WARM_UPPER),sec('act','Activation',3,ACT_PULL),
      sec('str','Strength',24,[str('rowSA',3,'10 each',75),str('pullover',3,'10',60),str('floorpress',3,'10',75),str('ohp',3,'10',75),str('curl',3,'12',45),str('triext',3,'12',45)]),
      sec('cardio','Cardio finisher',6,[card('bag')]),sec('cool','Cool-down',5,COOL_UPPER)]},
    Wed:{title:'Conditioning + Core — Fat-loss push',focus:'Cardio · Core',min:46,note:'Highest cardio volume of the week. This is where the definition you built gets revealed.',sections:[
      sec('warm','Warm-up',6,WARM_COND),sec('act','Activation',3,ACT_COND),
      sec('cardio','Cardio (main event)',28,[card('swingBig'),card('bagBig'),card('walk')]),
      sec('str','Core',8,[str('plank',3,'40–60s',30),str('bicycle',3,'24',30),str('sideplank',3,'25s each',30),str('deadbug',3,'12',30)]),
      sec('cool','Cool-down',5,COOL_COND)]},
    Fri:{title:'Full Lower — Keep the Muscle',focus:'Glutes · Legs',min:44,note:null,sections:[
      sec('warm','Warm-up',7,WARM_LOWER),sec('act','Glute activation',4,ACT_GLUTE),
      sec('str','Strength',24,[str('goblet',3,'10',90),str('rdl',3,'10',90),str('hipthrust',3,'12',75),str('lunge',3,'10 each',60),str('calf',3,'15',45)]),
      sec('cardio','Cardio finisher',5,[card('swing')]),sec('cool','Cool-down',5,COOL_LOWER)]},
    Sat:{title:'Total-Body Circuit + Cardio',focus:'Metabolic · Full body',min:45,note:'Circuit style: move between moves with little rest to keep the heart rate up. 3 rounds through the strength block.',sections:[
      sec('warm','Warm-up',6,WARM_COND),sec('act','Activation',3,ACT_GLUTE),
      sec('str','Circuit (3 rounds)',22,[str('goblet',3,'12',30),str('rowSA',3,'10 each',30),str('pushup',3,'10',30),str('hipthrust',3,'15',30),str('plank',3,'40s',30)]),
      sec('cardio','Cardio',14,[card('bag'),card('walk',true)]),sec('cool','Cool-down',5,COOL_COND)]},
  }},
};

/* Progression coaching text, keyed by phase + week. */
export function progressionTip(phase, week) {
  if (phase === 1) {
    if (week <= 2) return '<b>Weeks 1–2:</b> do 2 sets per strength move while you learn form. Log every weight.';
    if (week <= 5) return '<b>Full 3 sets now.</b> Add a rep or +2.5 lb whenever 12 reps feels easy.';
    if (week <= 8) return `<b>Week ${week}:</b> add a 4th set to your priority row and curl. Keep pushing the weight.`;
    return `<b>Final Phase 1 push (wk ${week}).</b> Beat last week by a rep or a little weight, every session.`;
  }
  if (phase === 2) {
    if (week <= 3) return '<b>New Upper/Lower split.</b> Learn the movements, moderate weight, focus on the squeeze.';
    if (week <= 10) return `<b>Build mode (wk ${week}).</b> Heavier: 6–10 reps. Add weight before reps. Eat enough to grow.`;
    return `<b>Late Phase 2 (wk ${week}).</b> You should be clearly stronger — keep the weights climbing on rows, presses, hinges.`;
  }
  return `<b>Refine (wk ${week}).</b> Small deficit — keep the weights heavy to hold your muscle, bring cardio volume up.`;
}
