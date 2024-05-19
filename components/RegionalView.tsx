import dynamic from "next/dynamic";
import styled from "styled-components";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";

import ComparisonTable from "../components/ComparisonTable";
import MapLabels from "../components/Map/MapLabels";
import ListIcon from "../public/icons/list.svg";
import MapIcon from "../public/icons/map.svg";
import ToggleButton from "../components/ToggleButton";
import DatasetButtonMenu from "./DatasetButtonMenu";
import DropDown from "../components/DropDown";
import { H2Regular, Paragraph } from "./Typography";
import { devices } from "../utils/devices";
import { dataOnDisplay } from "../utils/datasetDefinitions";
import type {
	Municipality,
	DatasetKey,
	DataDescriptions,
} from "../utils/types";
import { normalizeString } from "../utils/shared";
import { municipalityColumns, rankData } from "../utils/createMunicipalityList";
import Markdown from "./Markdown";
import {
	defaultDataView,
	secondaryDataView,
} from "../pages/[dataGroup]/[dataset]/[dataView]";

const Map = dynamic(() => import("../components/Map/Map"));

const InfoText = styled.div`
  padding: 0 16px;
`;

const ParagraphSource = styled(Paragraph)`
  font-size: 13px;
  color: ${({ theme }) => theme.grey};
`;

const TitleRow = styled.div`
position: absolute;
top: 0;
left: 0;
width: 100%;
display: flex;
flex-direction: row;
justify-content: start;
background-color: rgba(0, 0, 0, 0);
z-index: 110;
`;

const InfoContainer = styled.div`
  background: ${({ theme }) => theme.lightBlack};
  border-radius: 8px;
  margin-bottom: 32px;
  z-index: 15;
  ::-webkit-scrollbar {
    display: none;
  }
    position: relative;
    width: 100%;
    display: flex;
    flex-direction: column;
`;

const TitleContainer = styled.div`
z-index: 0; 
box-shadow: 0 2px 4px rgba(0,0,0,0.3);
// width: auto; 
margin: 16px 0 0 16px;
padding: 8px 16px;
border-radius: 12px;
background: ${({ theme }) => theme.midGreen};
background-color: ${({ theme }) => theme.midGreen};
align-items: flex-start;
`;

const FloatingH5 = styled.h5`
  font-size: 16px;
  font-weight: regular;
  line-height: 1.25;
  @media only screen and (${devices.tablet}) {
    font-size: 18px;
  }
`;
// FIXME Refactor so default data view is not assumed to be 'lista'
const ComparisonContainer = styled.div<{ $dataView: string }>`
  position: relative;
  overflow-y: scroll;
  z-index: 100;
  // TODO: Hardcoding this is not good.
  height: 400px;
  border-radius: 8px;
  display: flex;
  margin-top: ${({ $dataView }) =>
		$dataView === defaultDataView ? "64px" : "0"};

  @media only screen and (${devices.tablet}) {
    height: 500px;
  }

  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
  ::-webkit-scrollbar {
    /* Chrome, Safari and Opera */
    display: none;
  }
`;

type RegionalViewProps = {
	municipalities: Array<Municipality>;
	selectedDataset: DatasetKey;
	setSelectedDataset: (newData: DatasetKey) => void;
	selectedDataView: string;
	setSelectedDataView: (newData: string) => void;
	dataDescriptions: DataDescriptions;
};

function RegionalView({
	municipalities,
	selectedDataset,
	setSelectedDataset,
	selectedDataView,
	setSelectedDataView,
	dataDescriptions,
}: RegionalViewProps) {
	const router = useRouter();

	const handleDataChange = (newData: DatasetKey) => {
		setSelectedDataset(newData);
		const normalizedDataset = normalizeString(newData);
		router.push(
			`/geografiskt/${normalizedDataset}/${selectedDataView}`,
			undefined,
			{
				shallow: true,
			},
		);
	};
	const { t } = useTranslation();

	const municipalityNames = municipalities.map((item) => item.Name); // get all municipality names for drop down
	// get all municipality names and data points for map and list
	const municipalityData = dataOnDisplay(
		municipalities,
		selectedDataset,
		router.locale as string,
		t,
	);
	const datasetDescription = dataDescriptions[selectedDataset]; // get description of selected dataset

	const handleToggleView = () => {
		const newDataView =
			selectedDataView === defaultDataView
				? secondaryDataView
				: defaultDataView;
		setSelectedDataView(newDataView);
		router.replace(
			`/geografiskt/${normalizeString(
				selectedDataset as string,
			)}/${newDataView}`,
			undefined,
			{
				shallow: true,
			},
		);
	};

	const cols = municipalityColumns(
		selectedDataset,
		datasetDescription.columnHeader,
		t,
	);
	const rankedData = rankData(
		municipalities,
		selectedDataset,
		router.locale as string,
		t,
	);

	const isDefaultDataView = selectedDataView === defaultDataView;

	const routeString = "kommun";

	return (
		<>
			<H2Regular>{t("startPage:regionalView.questionTitle")}</H2Regular>
			<DatasetButtonMenu
				selectedData={selectedDataset}
				handleDataChange={handleDataChange}
				dataDescriptions={dataDescriptions}
			/>
			<InfoContainer>
				{/* TODO: Remove this margin hack and replace with flex/grid layout instead */}
				{!isDefaultDataView ? (
					<TitleRow>
						<TitleContainer>
							<FloatingH5>{datasetDescription.title}</FloatingH5>
							<MapLabels
								labels={datasetDescription.labels}
								rotations={datasetDescription.labelRotateUp}
							/>
						</TitleContainer>
					</TitleRow>
				) : null}
				<ToggleButton
					handleClick={handleToggleView}
					// FIXME Refactor so default data view is not assumed to be 'lista'.
					// Below code should not need to be edited when changing default data view
					text={
						isDefaultDataView
							? t("startPage:toggleView.map")
							: t("startPage:toggleView.list")
					}
					icon={isDefaultDataView ? <MapIcon /> : <ListIcon />}
				/>
				<ComparisonContainer $dataView={selectedDataView.toString()}>
					{isDefaultDataView ? (
						<ComparisonTable
							data={rankedData[selectedDataset]}
							columns={cols}
							routeString={routeString}
						/>
					) : (
						<>
							<Map
								data={municipalityData}
								boundaries={datasetDescription.boundaries}
							/>
						</>
					)}
				</ComparisonContainer>
				<InfoText>
					<Markdown>{datasetDescription.body}</Markdown>
					<Markdown components={{ p: ParagraphSource }}>
						{datasetDescription.source}
					</Markdown>
				</InfoText>
			</InfoContainer>
			<DropDown
				municipalitiesName={municipalityNames}
				placeholder={t("startPage:regionalView.yourMunicipality")}
			/>
		</>
	);
}

export default RegionalView;
