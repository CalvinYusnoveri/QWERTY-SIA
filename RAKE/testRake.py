from rake_nltk import Rake

r = Rake()

mytext = '''
SECTION 74-00: IGNITION
SUBJECT 00: IGNITION
74-00-00 PAGE BLOCK 0: DESCRIPTION AND OPERATION (EFFECTIVITY: 001999 ALL)
1. General
A. The ignition system (Fig. 1) consists of an engine start switch, engine igniter selector switch, 2 high energy
ignition exciters or 2 low energy ignition exciters, 2 spark igniters and 2 coaxial shielded ignition leads.
B. The purpose of the system is to produce an electrical spark to ignite the fuel and air mixture
in the engine combustion chamber during the start cycle and to provide continuous ignition
during takeoff, landing and operation in adverse weather conditions.
C. The left, right or the two spark igniters can be selected during the start cycle or
for continuous ignition operation.
D. The ignition system consists of the Ignition Power Supply, 74-11-00; High Tension
Distribution, 74-21-00; and Engine Ignition Control, 74-31-00.
74-00-00
TSN # 67 Revison Date: 20070712
'''

r.extract_keywords_from_text(mytext)
results = r.get_ranked_phrases_with_scores()

for result in results:
    print(result)
