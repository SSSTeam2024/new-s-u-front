import { Text, View, Image } from "@react-pdf/renderer";

interface ChildProps {
  formattedDate: string;
  signature_directeur: string;
  gouvernorat_fr: string;
}

const SignaturePDF: React.FC<ChildProps> = ({
  formattedDate,
  signature_directeur,
  gouvernorat_fr,
}) => {
  return (
    <>
      <View style={{ display: "flex", flexDirection: "row", marginBottom: 5 }}>
        <View style={{ flex: 1, alignItems: "flex-end" }}>
          <Text>
            {" "}
            Fait à {gouvernorat_fr} le {formattedDate}
          </Text>
        </View>
      </View>
      <View style={{ display: "flex", flexDirection: "row", marginBottom: 5 }}>
        <View style={{ flex: 1, alignItems: "flex-end" }}>
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

export default SignaturePDF;
