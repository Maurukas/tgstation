/datum/supply_pack/medical
	group = "Medical"
	access_view = ACCESS_MEDICAL
	crate_type = /obj/structure/closet/crate/medical

/datum/supply_pack/medical/bloodpacks
	name = "Blood Pack Variety Crate"
	desc = "Contains ten different blood packs for reintroducing blood to patients and three autoinjectors for treating mild blood loss."
	cost = CARGO_CRATE_VALUE * 7
	contains = list(/obj/item/reagent_containers/blood = 2,
					/obj/item/reagent_containers/blood/a_plus,
					/obj/item/reagent_containers/blood/a_minus,
					/obj/item/reagent_containers/blood/b_plus,
					/obj/item/reagent_containers/blood/b_minus,
					/obj/item/reagent_containers/blood/o_plus,
					/obj/item/reagent_containers/blood/o_minus,
					/obj/item/reagent_containers/blood/lizard,
					/obj/item/reagent_containers/blood/ethereal,
					/obj/item/reagent_containers/hypospray/medipen/blood_loss = 3,
				)
	crate_name = "blood freezer"
	crate_type = /obj/structure/closet/crate/freezer

/datum/supply_pack/medical/medipen_epinephrine
	name = "Epinephrine Medipen Kit"
	desc = "Contains eight epinephrine medipens."
	cost = CARGO_CRATE_VALUE * 5
	contains = list(/obj/item/reagent_containers/hypospray/medipen = 8,)
	crate_name = "epinephrine medipen crate"

/datum/supply_pack/medical/coroner_crate
	name = "Autopsy Kit"
	desc = "Contains an autopsy scanner, when you lose your own and really \
		need to complete your dissection experiments."
	cost = CARGO_CRATE_VALUE * 2.5
	contains = list(
		/obj/item/autopsy_scanner = 1,
		/obj/item/storage/medkit/coroner = 1,
		/obj/item/reagent_containers/cup/bottle/formaldehyde = 2,
		/obj/item/storage/box/bodybags,
	)
	crate_name = "autopsy kit crate"

/datum/supply_pack/medical/defibs
	name = "Defibrillator Crate"
	desc = "Contains two defibrillators for bringing the recently deceased back to life."
	cost = CARGO_CRATE_VALUE * 4
	contains = list(/obj/item/defibrillator/loaded = 2)
	crate_name = "defibrillator crate"

/datum/supply_pack/medical/iv_drip
	name = "IV Drip Crate"
	desc = "Contains a single IV drip for administering blood to patients."
	cost = CARGO_CRATE_VALUE * 2
	contains = list(/obj/machinery/iv_drip,
					/obj/item/reagent_containers/chem_pack = 3,
				)
	crate_name = "iv drip crate"

/datum/supply_pack/medical/surplus
	name = "Medical Surplus Crate"
	desc = "Contains a random assortment of surplus medical supplies. Questionably useful."
	cost = CARGO_CRATE_VALUE * 2
	contains = list(/obj/item/reagent_containers/cup/bottle/multiver,
					/obj/item/reagent_containers/cup/bottle/epinephrine,
					/obj/item/reagent_containers/cup/bottle/morphine,
					/obj/item/reagent_containers/cup/bottle/synaptizine,
					/obj/item/reagent_containers/cup/bottle/formaldehyde,
					/obj/item/reagent_containers/cup/bottle/salglu_solution,
					/obj/item/reagent_containers/syringe/antiviral,
					/obj/item/reagent_containers/medigel/libital,
					/obj/item/reagent_containers/medigel/aiuri,
					/obj/item/reagent_containers/medigel/sterilizine,
					/obj/item/reagent_containers/blood/o_minus,
					/obj/item/reagent_containers/pill/neurine,
					/obj/item/reagent_containers/hypospray/medipen = 2,
					/obj/item/reagent_containers/hypospray/medipen/blood_loss,
					/obj/item/reagent_containers/hypospray/medipen/ekit,
					/obj/item/reagent_containers/chem_pack,
					/obj/item/storage/box/beakers,
					/obj/item/storage/box/medigels,
					/obj/item/storage/box/syringes,
					/obj/item/storage/box/bodybags,
					/obj/item/defibrillator/loaded,
					/obj/item/storage/pill_bottle/mining,
					/obj/item/stack/medical/ointment,
					/obj/item/stack/medical/suture,
					/obj/item/stack/medical/bone_gel,
					/obj/item/stack/medical/gauze,
					/obj/item/healthanalyzer/simple,
					/obj/item/clothing/glasses/eyepatch/medical
				)
	crate_name = "medical surplus crate"

/datum/supply_pack/medical/supplies/fill(obj/structure/closet/crate/C)
	for(var/i in 1 to 5)
		var/item = pick(contains)
		new item(C)

/datum/supply_pack/medical/medkit
	name = "Medkit Supply Crate"
	desc = "Contains one of each standard medical kit."
	cost = CARGO_CRATE_VALUE * 20
	contains = list(/obj/item/storage/medkit/regular,
					/obj/item/storage/medkit/o2,
					/obj/item/storage/medkit/toxin,
					/obj/item/storage/medkit/brute,
					/obj/item/storage/medkit/fire,
				)
	crate_name = "medkit supplies crate"

/datum/supply_pack/medical/firstaid
	name = "First Aid Supply Crate"
	desc = "Contains four basic first aid kits, suitable for treating minor workplace injuries."
	cost = CARGO_CRATE_VALUE * 4
	contains = list(/obj/item/storage/medkit/emergency = 4)
	crate_name = "first aid supplies crate"

/datum/supply_pack/medical/experimentalmedicine
	name = "Experimental Medicine Crate"
	desc = "A crate containing the medication required for living with Hereditary Manifold Sickness, Sansufentanyl."
	cost = CARGO_CRATE_VALUE * 2
	contains = list(/obj/item/storage/pill_bottle/sansufentanyl = 2)
	crate_name = "experimental medicine crate"

/datum/supply_pack/medical/surgery
	name = "Surgical Supplies Crate"
	desc = "Do you want to perform surgery, but don't have one of those fancy \
		shmancy degrees? Just get started with this crate containing a medical duffelbag, \
		Sterilizine spray, bone gel, and collapsible roller bed."
	cost = CARGO_CRATE_VALUE * 6
	contains = list(
		/obj/item/storage/backpack/duffelbag/med/surgery,
		/obj/item/reagent_containers/medigel/sterilizine,
		/obj/item/stack/medical/bone_gel = 2,
		/obj/item/roller,
	)
	crate_name = "surgical supplies crate"

/datum/supply_pack/medical/salglucanister
	name = "Heavy-Duty Saline Canister"
	desc = "Contains a bulk supply of saline-glucose condensed into a single canister that \
		should last several days, with a large pump to fill containers with. Direct injection \
		of saline should be left to medical professionals as the pump is capable of overdosing \
		patients."
	cost = CARGO_CRATE_VALUE * 6
	access = ACCESS_MEDICAL
	contains = list(/obj/machinery/iv_drip/saline)

/datum/supply_pack/medical/virus
	name = "Virus Crate"
	desc = "Contains twelve different bottles of several viral samples for virology \
		research. Also includes seven beakers and syringes. Balled-up jeans not included."
	cost = CARGO_CRATE_VALUE * 5
	access = ACCESS_CMO
	access_view = ACCESS_VIROLOGY
	contains = list(/obj/item/reagent_containers/cup/bottle/flu_virion,
					/obj/item/reagent_containers/cup/bottle/cold,
					/obj/item/reagent_containers/cup/bottle/random_virus = 4,
					/obj/item/reagent_containers/cup/bottle/fake_gbs,
					/obj/item/reagent_containers/cup/bottle/magnitis,
					/obj/item/reagent_containers/cup/bottle/pierrot_throat,
					/obj/item/reagent_containers/cup/bottle/brainrot,
					/obj/item/reagent_containers/cup/bottle/anxiety,
					/obj/item/reagent_containers/cup/bottle/beesease,
					/obj/item/storage/box/syringes,
					/obj/item/storage/box/beakers,
					/obj/item/reagent_containers/cup/bottle/mutagen,
				)
	crate_name = "virus crate"
	crate_type = /obj/structure/closet/crate/secure/plasma
	dangerous = TRUE

/datum/supply_pack/medical/cmoturtlenecks
	name = "Chief Medical Officer Turtlenecks"
	desc = "Contains the CMO's turtleneck and turtleneck skirt."
	cost = CARGO_CRATE_VALUE * 2
	access = ACCESS_CMO
	contains = list(/obj/item/clothing/under/rank/medical/chief_medical_officer/turtleneck,
					/obj/item/clothing/under/rank/medical/chief_medical_officer/turtleneck/skirt,
				)

/datum/supply_pack/medical/arm_implants
	name = "Strong-Arm Implant Set"
	desc = "A crate containing two implants, which can be surgically implanted to empower the strength of human arms. Warranty void if exposed to electromagnetic pulses."
	cost = CARGO_CRATE_VALUE * 6
	contains = list(/obj/item/organ/internal/cyberimp/arm/muscle = 2)
	crate_name = "Strong-Arm implant crate"

/datum/supply_pack/medical/anesthetic
	name = "A large portable gas canister filled with anesthetic mix. \
		Suitable for use in surgery or cryogenics."
	cost = CARGO_CRATE_VALUE * 5
	contains = list(/obj/machinery/portable_atmospherics/canister/anesthetic_mix)
	crate_name = "medical anesthetic tank"
	crate_type = /obj/structure/closet/crate/large
