import React from 'react'
import { Pressable, SafeAreaView, StyleSheet, Text, View, ScrollView } from 'react-native';
import { fontSizes, fontWeights, normalize, theme } from '../util/constants';
import { Ionicons } from '@expo/vector-icons';


const Document = ({ navigation, route }) => {
  const { DocType } = route.params;


  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={true}>
        {DocType === 'Policy' ?
          <View style={{ padding: normalize(10) }}>
            <View style={{ flexDirection: 'row', gap: normalize(5), alignItems: "center" }}>
              <Pressable onPress={() => navigation.goBack()} style={{ marginLeft: normalize(-5) }}>
                <Ionicons name="chevron-back" size={30} color={theme.colors.dark} />
              </Pressable>
              <Text style={styles.heading}>Privacy Policy</Text>
            </View>
            <View style={styles.contentContainer}>
              <Text style={styles.sectionHeading}>Effective Date: 12th July, 2023</Text>

              <Text style={styles.sectionText}>
                This Privacy Policy ("Policy") outlines how we collect, use, store, and disclose your information when you use the yeet mobile application ("App") as a user. Please read this Policy carefully to understand our practices regarding your personal information. By using the App, you agree to the terms of this Policy.
              </Text>

              <Text style={styles.sectionHeading}>Information We Collect</Text>

              <Text style={styles.sectionSubHeading}>1.1 Personal Information:</Text>
              <Text style={styles.sectionText}>
                When you create an account on the App, we may collect certain personal information from you, such as your name, email address, username, and profile picture.
              </Text>

              <Text style={styles.sectionSubHeading}>1.2 User Content:</Text>
              <Text style={styles.sectionText}>
                The App allows you to share images, texts, and other content ("User Content"). User Content shared on the App may be collected and stored by us.
              </Text>

              <Text style={styles.sectionSubHeading}>1.3 Usage Data:</Text>
              <Text style={styles.sectionText}>
                We may collect information about your use of the App, including your device information, IP address, operating system, and app usage statistics.
              </Text>

              <Text style={styles.sectionHeading}>Use of Information</Text>

              <Text style={styles.sectionSubHeading}>2.1 Personal Information:</Text>
              <Text style={styles.sectionText}>
                We may use your personal information to create and manage your account, communicate with you, provide customer support, and improve our services.
              </Text>

              <Text style={styles.sectionSubHeading}>2.2 User Content:</Text>
              <Text style={styles.sectionText}>
                User Content shared on the App may be used to display and share with other users as intended by the App's functionality. We may also use anonymized and aggregated User Content for statistical analysis and to improve the App.
              </Text>

              <Text style={styles.sectionSubHeading}>2.3 Usage Data:</Text>
              <Text style={styles.sectionText}>
                We may use usage data to analyze trends, administer the App, improve our services, and ensure the App's security and integrity.
              </Text>

              <Text style={styles.sectionHeading}>Data Storage and Security</Text>

              <Text style={styles.sectionSubHeading}>3.1 Data Storage:</Text>
              <Text style={styles.sectionText}>
                Your personal information and User Content may be stored on servers located in various countries. By using the App, you consent to the transfer of your information to these servers.
              </Text>

              <Text style={styles.sectionSubHeading}>3.2 Data Security: </Text>
              <Text style={styles.sectionText}>
                We implement reasonable security measures to protect your information from unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
              </Text>


              <Text style={styles.sectionHeading}>Sharing Information</Text>

              <Text style={styles.sectionSubHeading}>4.1 Third-Party Service Providers:</Text>
              <Text style={styles.sectionText}>
                We may share your information with third-party service providers who assist us in operating the App, analyzing data, and providing related services. These service providers are bound by confidentiality obligations and are prohibited from using your information for any other purpose.
              </Text>

              <Text style={styles.sectionSubHeading}>4.2 Legal Compliance:</Text>
              <Text style={styles.sectionText}>
                We may disclose your information if required by law, regulation, or legal process, or to protect our rights, property, or the safety of others.

              </Text>

              <Text style={styles.sectionSubHeading}>4.3 Change of Ownership:</Text>
              <Text style={styles.sectionText}>
                In the event of a merger, acquisition, or sale of all or a portion of our assets, your information may be transferred to the acquiring entity.
              </Text>

              <Text style={styles.sectionHeading}>Children's Policy</Text>

              <Text style={styles.sectionText}>
                The App is not intended for use by individuals under the age of 13. We do not knowingly collect personal information from children under 13. If you believe we may have collected information from a child under 13, please contact us immediately.
              </Text>

              <Text style={styles.sectionHeading}>Changes to this Policy</Text>


              <Text style={styles.sectionText}>
                We reserve the right to modify this Policy at any time. Any changes will be effective when we post the revised Policy on the App. Your continued use of the App after the changes indicate your acceptance of the revised Policy.
              </Text>

            </View>
          </View>
          : DocType === 'Terms' ?
            <View style={{ paddingVertical: normalize(10) }}>
              <View style={{ flexDirection: 'row', gap: normalize(5), alignItems: "center" }}>
                <Pressable onPress={() => navigation.goBack()} style={{ marginLeft: normalize(-5) }}>
                  <Ionicons name="chevron-back" size={30} color={theme.colors.dark} />
                </Pressable>
                <Text style={styles.heading}>Terms of Service</Text>
              </View>
              <View style={styles.contentContainer}>

                <Text style={styles.sectionHeading}>App Usage</Text>

                <Text style={styles.sectionSubHeading}>1.1 Eligibility:</Text>
                <Text style={styles.sectionText}>
                  You must be at least 13 years old to use the App. By using the App, you represent and warrant that you meet the age requirement.
                </Text>

                <Text style={styles.sectionSubHeading}>1.2 License:</Text>
                <Text style={styles.sectionText}>
                  We grant you a limited, non-exclusive, non-transferable, revocable license to use the App for personal, non-commercial purposes.
                </Text>

                <Text style={styles.sectionSubHeading}>1.3 Prohibited Conduct:</Text>
                <Text style={styles.sectionText}>
                  You agree not to engage in any of the following activities: violating any applicable laws or regulations, uploading, sharing, or transmitting any unlawful, defamatory, or abusive content, impersonating another person or entity, interfering with the App's functionality, or engaging in any conduct that may harm the App or its users.
                </Text>

                <Text style={styles.sectionText}>
                  • Violating any applicable laws or regulations.
                </Text>

                <Text style={styles.sectionText}>•
                  Uploading, sharing, or transmitting any content that is unlawful, defamatory, abusive, or violates any third-party rights. </Text>

                <Text style={styles.sectionText}>•
                  Impersonating another person or entity or falsely representing your affiliation with any person or entity. </Text>

                <Text style={styles.sectionText}>•
                  Interfering with the App's functionality or attempting to gain unauthorized access to any systems or networks connected to the App. </Text>

                <Text style={styles.sectionText}>•
                  Engaging in any conduct that may harm the App or its users.
                </Text>


                <Text style={styles.sectionHeading}>Intellectual Property</Text>

                <Text style={styles.sectionText}>
                  All intellectual property rights in the App, including but not limited to trademarks, copyrights, and proprietary information, are owned by us or our licensors. You agree not to reproduce, modify, distribute, or create derivative works based on the App without our explicit permission. </Text>

                <Text style={styles.sectionHeading}>Disclaimers and Limitations of Liability</Text>

                <Text style={styles.sectionSubHeading}>3.1 App Availability:</Text>
                <Text style={styles.sectionText}>
                  We strive to provide a reliable and accessible App but do not guarantee uninterrupted or error-free operation.
                </Text>

                <Text style={styles.sectionSubHeading}>3.2 User Content:</Text>
                <Text style={styles.sectionText}>
                  We do not endorse or guarantee the accuracy, reliability, or legality of User Content. You use User Content at your own risk.
                </Text>

                <Text style={styles.sectionSubHeading}>3.3 Third-Party Links:</Text>
                <Text style={styles.sectionText}>
                  The App may contain links to third-party websites or services. We do not endorse or control these third-party sites and are not responsible for their content or privacy practices.
                </Text>

                <Text style={styles.sectionSubHeading}>3.4 Limitation of Liability:</Text>
                <Text style={styles.sectionText}>
                  To the extent permitted by applicable law, we shall not be liable for any direct, indirect, incidental, consequential, or punitive damages arising out of your use of the App.
                </Text>

                <Text style={styles.sectionHeading}>Indemnification</Text>

                <Text style={styles.sectionText}>
                  You agree to indemnify and hold us harmless from any claims, damages, losses, liabilities, costs, and expenses (including legal fees) arising out of your use of the App or violation of these Terms of Service.
                </Text>

                <Text style={styles.sectionHeading}>Governing Law and Jurisdiction</Text>

                <Text style={styles.sectionText}>
                  These Terms of Service shall be governed by and construed in accordance with the laws of India. Any disputes arising from these Terms shall be subject to the exclusive jurisdiction of the courts located in India.</Text>
              </View>
            </View>
            : DocType === 'EULA' &&
            <View style={{ paddingVertical: normalize(10) }}>
              <View style={{ flexDirection: 'row', gap: normalize(5), alignItems: "center" }}>
                <Pressable onPress={() => navigation.goBack()} style={{ marginLeft: normalize(-5) }}>
                  <Ionicons name="chevron-back" size={30} color={theme.colors.dark} />
                </Pressable>
                <Text style={styles.heading}>End User License Agreement (EULA)</Text>
              </View>
              <View style={styles.contentContainer}>
                <Text style={styles.sectionHeading}></Text>
                <Text style={styles.sectionText}>
                  PLEASE READ THIS END USER LICENSE AGREEMENT ("EULA") CAREFULLY BEFORE SIGNING UP ON THE YEET APP ("APP"). BY SIGNING UP ON THE APP, YOU AGREE TO BE BOUND BY THE TERMS AND CONDITIONS OF THIS EULA. IF YOU DO NOT AGREE TO THE TERMS AND CONDITIONS OF THIS EULA, DO NOT INSTALL OR USE THE APP.
                </Text>

                <Text style={styles.sectionHeading}>1. LICENSE GRANT</Text>

                <Text style={styles.sectionText}>
                  Subject to your compliance with this EULA, we grant you a limited, non-exclusive, non-transferable, revocable license to install and use the App on your iOS device solely for personal, non-commercial purposes.
                </Text>

                <Text style={styles.sectionHeading}>2. PROHIBITED CONDUCT</Text>

                <Text style={styles.sectionText}>
                  You agree that you will not engage in any of the following prohibited conduct while using the App:</Text>
                <Text style={styles.sectionSubHeading}>2.1 Posting Objectionable Content: </Text>
                <Text style={styles.sectionText}>You must not post or share any content that is unlawful, defamatory, abusive, harassing, obscene, sexually explicit, or otherwise objectionable. We have a zero-tolerance policy towards objectionable content.</Text>

                <Text style={styles.sectionSubHeading}>2.2 Abusive Behavior: </Text>
                <Text style={styles.sectionText}>You must not engage in any abusive or harassing behavior towards other users. This includes but is not limited to bullying, stalking, threatening, or any other behavior that is intended to intimidate, harm, or harass others.</Text>

                <Text style={styles.sectionSubHeading}>2.3 Illegal Activities: </Text>
                <Text style={styles.sectionText}>You must not use the App for any illegal activities, including but not limited to copyright infringement, hacking, or distributing unauthorized or illegal content.</Text>

                <Text style={styles.sectionSubHeading}>2.4 Impersonation: </Text>
                <Text style={styles.sectionText}>You must not impersonate another person or entity or falsely represent your affiliation with any person or entity.
                </Text>

                <Text style={styles.sectionSubHeading}>2.5 Unauthorized Use: </Text>
                <Text style={styles.sectionText}>You must not use the App in any way that violates this EULA or any applicable laws or regulations.</Text>

                <Text style={styles.sectionHeading}>3. CONTENT MONITORING</Text>

                <Text style={styles.sectionText}>
                  We have the right, but not the obligation, to monitor and review the content posted or shared through the App. We reserve the right to remove any content that violates this EULA or is deemed objectionable in our sole discretion. However, we do not guarantee that all objectionable content will be identified and removed.
                </Text>

                <Text style={styles.sectionHeading}>4. ACCOUNT TERMINATION</Text>

                <Text style={styles.sectionText}>
                  In the event of a violation of this EULA, we reserve the right to terminate your account and restrict your access to the App, with or without prior notice. We may also take legal action or cooperate with law enforcement authorities if necessary.
                </Text>

                <Text style={styles.sectionHeading}>5. INTELLECTUAL PROPERTY</Text>

                <Text style={styles.sectionText}>
                  The App and its associated trademarks, copyrights, and other intellectual property rights are owned by us or our licensors. You acknowledge that you have no ownership or proprietary rights in the App.
                </Text>

                <Text style={styles.sectionHeading}>6. DISCLAIMER OF WARRANTIES</Text>

                <Text style={styles.sectionText}>
                  THE APP IS PROVIDED ON AN "AS IS" BASIS, WITHOUT WARRANTIES OF ANY KIND, WHETHER EXPRESS OR IMPLIED. WE DISCLAIM ALL WARRANTIES, INCLUDING BUT NOT LIMITED TO MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT. WE DO NOT WARRANT THAT THE APP WILL BE ERROR-FREE OR UNINTERRUPTED.
                </Text>

                <Text style={styles.sectionHeading}>7. LIMITATION OF LIABILITY</Text>

                <Text style={styles.sectionText}>
                  TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL WE BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING OUT OF OR RELATED TO YOUR USE OF THE APP, EVEN IF WE HAVE BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.
                </Text>

                <Text style={styles.sectionHeading}>8. GOVERNING LAW AND JURISDICTION</Text>

                <Text style={styles.sectionText}>
                  This EULA shall be governed by and construed in accordance with the laws of State of West Bengal. Any disputes arising from this EULA shall be subject to the exclusive jurisdiction of the courts located in West Bengal.
                </Text>

                <Text style={styles.sectionHeading}>9. ENTIRE AGREEMENT</Text>

                <Text style={styles.sectionText}>
                  This EULA constitutes the entire agreement between you and us regarding the App and supersedes all prior or contemporaneous understandings or agreements, whether written or oral.
                </Text>


                <Text style={styles.sectionText}>
                  If you have any questions or concerns regarding this EULA, please contact us at hello@yeet.network
                </Text>

                <Text style={styles.sectionText}>
                  Last updated: 7/18/2023</Text>
              </View>
            </View>}
      </ScrollView>
    </SafeAreaView >
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: normalize(20),
    backgroundColor: theme.colors.light
  },
  title: {
    fontSize: fontSizes.large,
    fontWeight: fontWeights.normal,
    textDecorationLine: 'underline'
  },
  contentContainer: {
  },
  heading: {
    fontSize: fontSizes.heading,
    fontWeight: 'bold',
  },
  sectionHeading: {
    fontSize: fontSizes.large,
    fontWeight: 'bold',
    marginTop: normalize(20),
  },
  sectionSubHeading: {
    fontSize: fontSizes.medium,
    fontWeight: 'bold',
    marginTop: normalize(15),
  },
  sectionText: {
    fontSize: fontSizes.medium,
    marginTop: normalize(5),
    marginBottom: normalize(10),
  },
})

export default Document