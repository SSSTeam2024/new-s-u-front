import { Text, View, Image } from "@react-pdf/renderer";

interface ChildProps {
  formattedDate: string;
  signature_directeur: string;
  gouvernorat_ar: string;
}

const ArSignaturePDF: React.FC<ChildProps> = ({
  formattedDate,
  signature_directeur,
  gouvernorat_ar,
}) => {
  return (
    <>
      <View style={{ display: "flex", flexDirection: "row", marginBottom: 5 }}>
        <View style={{ flex: 1, alignItems: "flex-start" }}>
          <Text>
            {gouvernorat_ar} في {formattedDate}
          </Text>
        </View>
      </View>
      <View style={{ display: "flex", flexDirection: "row", marginBottom: 5 }}>
        <View style={{ flex: 1, alignItems: "flex-start" }}>
          <Image
            style={{
              width: 100,
            }}
            src={`${process.env.REACT_APP_API_URL}/files/variableGlobaleFiles/signatureDirecteurFiles/${signature_directeur}`}
          />
        </View>
      </View>
    </>
  );
};

export default ArSignaturePDF;
